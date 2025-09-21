import mongoose from 'mongoose';
import Response from '../models/Response.js';
import Form from '../models/Form.js';
import { ApiError } from '../utils/errors.js';

/**
 * Service for generating analytics from form responses
 */
export class AnalyticsService {
  /**
   * Get response statistics for a form
   * @param {string} formId - The form ID to get statistics for
   * @returns {Promise<Object>} The response statistics
   */
  static async getFormStatistics(formId) {
    try {
      // Use aggregation for better performance
      const responses = await Response.aggregate([
        { $match: { formId: mongoose.Types.ObjectId(formId) } },
        { $group: {
          _id: null,
          totalResponses: { $sum: 1 },
          averageTimeSpent: { $avg: '$time' },
          sentiments: { $push: '$sentiment' },
          isCompleteCount: { $sum: { $cond: ['$isComplete', 1, 0] } },
          certificatesSentCount: { $sum: { $cond: ['$certificateSent', 1, 0] } }
        }}
      ]);

      if (!responses.length) {
        return {
          overview: {
            totalResponses: 0,
            averageTimeSpent: 0,
            completionRate: 0,
            certificatesSent: 0
          },
          sentimentStats: {},
          lastUpdated: new Date()
        };
      }

      const stats = responses[0];

      // Calculate sentiment stats
      const sentimentStats = stats.sentiments.reduce((acc, sentiment) => {
        if (sentiment && sentiment.label) {
          acc[sentiment.label] = (acc[sentiment.label] || 0) + 1;
        }
        return acc;
      }, {});

      const completionRate = (stats.isCompleteCount / stats.totalResponses) * 100;

      return {
        overview: {
          totalResponses: stats.totalResponses,
          averageTimeSpent: stats.averageTimeSpent,
          completionRate,
          certificatesSent: stats.certificatesSentCount
        },
        sentimentStats,
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('Error generating form statistics:', error);
      throw error;
    }
  }

  /**
   * Get aggregated statistics across all forms
   * @returns {Promise<Object>} The aggregated statistics
   */
  static async getAggregatedStatistics() {
    try {
      const [responses, forms] = await Promise.all([
        Response.find({ isComplete: true }),
        Form.find({ isPublished: true })
      ]);

      const totalForms = forms.length;
      const totalResponses = responses.length;
      const averageResponsesPerForm = totalForms > 0 ? totalResponses / totalForms : 0;

      const responsesByDay = {};
      responses.forEach(response => {
        const date = response.createdAt.toISOString().split('T')[0];
        responsesByDay[date] = (responsesByDay[date] || 0) + 1;
      });

      // Get forms with highest response rates
      const formStats = await Promise.all(forms.map(async form => {
        const responseCount = await Response.countDocuments({ formId: form._id });
        return {
          formId: form._id,
          title: form.title,
          responseCount
        };
      }));

      formStats.sort((a, b) => b.responseCount - a.responseCount);
      const topForms = formStats.slice(0, 5);

      // Overall sentiment analysis
      const sentimentStats = {
        positive: responses.filter(r => r.sentiment?.label === 'positive').length,
        neutral: responses.filter(r => r.sentiment?.label === 'neutral').length,
        negative: responses.filter(r => r.sentiment?.label === 'negative').length
      };

      return {
        overview: {
          totalForms,
          totalResponses,
          averageResponsesPerForm,
          certificatesSent: responses.filter(r => r.certificateSent).length
        },
        responsesByDay,
        topForms,
        sentimentStats,
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('Error generating aggregated statistics:', error);
      throw error;
    }
  }
}

export default AnalyticsService;
          { $group: {
            _id: null,
            total: { $sum: 1 },
            avgTime: { $avg: '$time' },
            sentiment: {
              $push: {
                label: '$sentiment.label',
                score: '$sentiment.score'
              }
            }
          }},
          { $project: {
            _id: 0,
            total: 1,
            avgTime: 1,
            sentiment: 1
          }}
        ])
      ]);

      if (!responses.length) return { total: 0, avgTime: 0 };

      const stats = responses[0];
      const sentiment = stats.sentiment.reduce((acc, s) => {
        acc[s.label] = (acc[s.label] || 0) + 1;
        return acc;
      }, {});

      return {
        overview: {
          totalResponses,
          averageTimeSpent,
          completionRate: (responses.filter(r => r.isComplete).length / responses.length) * 100,
          certificatesSent: responses.filter(r => r.certificateSent).length
        },
        questionStats,
        deviceStats,
        sentimentStats,
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('Error generating form statistics:', error);
      throw error;
    }
  }

  /**
   * Get aggregated statistics across all forms
   * @returns {Promise<Object>} The aggregated statistics
   */
  static async getAggregatedStatistics() {
    try {
      const [responses, forms] = await Promise.all([
        Response.find({ isComplete: true }),
        Form.find({ isPublished: true })
      ]);

      const totalForms = forms.length;
      const totalResponses = responses.length;
      const averageResponsesPerForm = totalResponses / totalForms;

      const responsesByDay = {};
      responses.forEach(response => {
        const date = response.createdAt.toISOString().split('T')[0];
        responsesByDay[date] = (responsesByDay[date] || 0) + 1;
      });

      // Get forms with highest response rates
      const formStats = await Promise.all(forms.map(async form => {
        const responseCount = await Response.countDocuments({ formId: form._id });
        return {
          formId: form._id,
          title: form.title,
          responseCount
        };
      }));

      formStats.sort((a, b) => b.responseCount - a.responseCount);
      const topForms = formStats.slice(0, 5);

      // Overall sentiment analysis
      const sentimentStats = {
        positive: responses.filter(r => r.sentiment?.label === 'positive').length,
        neutral: responses.filter(r => r.sentiment?.label === 'neutral').length,
        negative: responses.filter(r => r.sentiment?.label === 'negative').length
      };

      return {
        overview: {
          totalForms,
          totalResponses,
          averageResponsesPerForm,
          certificatesSent: responses.filter(r => r.certificateSent).length
        },
        responsesByDay,
        topForms,
        sentimentStats,
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('Error generating aggregated statistics:', error);
      throw error;
    }
  }
}

export default AnalyticsService;