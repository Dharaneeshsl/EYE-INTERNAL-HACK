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
    if (!mongoose.Types.ObjectId.isValid(formId)) {
      throw new ApiError(400, 'Invalid form ID format');
    }

    try {
      // Use aggregation for better performance
      const responses = await Response.aggregate([
        { $match: { formId: new mongoose.Types.ObjectId(formId) } },
        { 
          $group: {
            _id: null,
            totalResponses: { $sum: 1 },
            averageTimeSpent: { $avg: '$time' },
            sentiments: { $push: '$sentiment' },
            isCompleteCount: { $sum: { $cond: ['$complete', 1, 0] } },
            certificatesSentCount: { $sum: { $cond: ['$cert.sent', 1, 0] } }
          }
        }
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
      throw new ApiError(500, 'Failed to generate form statistics', true, error);
    }
  }

  /**
   * Get aggregated statistics across all forms
   * @returns {Promise<Object>} The aggregated statistics
   */
  static async getAggregatedStatistics() {
    try {
      const [responses, forms] = await Promise.all([
        Response.find({ complete: true }),
        Form.find({ isPublished: true })
      ]);

      const totalForms = forms.length;
      const totalResponses = responses.length;
      const averageResponsesPerForm = totalForms > 0 ? totalResponses / totalForms : 0;

      const responsesByDay = responses.reduce((acc, response) => {
        const date = response.createdAt.toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      // Get forms with highest response rates
      const formStats = await Promise.all(forms.map(async form => {
        const responseCount = await Response.countDocuments({ formId: form._id });
        return {
          formId: form._id,
          title: form.title,
          responseCount
        };
      }));

      // Sort forms by response count (descending) and get top 5
      const topForms = [...formStats]
        .sort((a, b) => b.responseCount - a.responseCount)
        .slice(0, 5);

      // Calculate overall sentiment distribution
      const allResponses = await Response.find({ complete: true });
      const sentimentStats = allResponses.reduce((acc, response) => {
        const label = response.sentiment?.label || 'unknown';
        acc[label] = (acc[label] || 0) + 1;
        return acc;
      }, {});

      return {
        overview: {
          totalForms,
          totalResponses,
          averageResponsesPerForm: Math.round(averageResponsesPerForm * 100) / 100, // Round to 2 decimal places
          certificatesSent: allResponses.filter(r => r.cert?.sent).length
        },
        responsesByDay,
        topForms,
        sentimentStats,
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('Error generating aggregated statistics:', error);
      throw new ApiError(500, 'Failed to generate aggregated statistics', true, error);
    }
  }
}

export default AnalyticsService;