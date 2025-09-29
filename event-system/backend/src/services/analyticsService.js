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
      // Use aggregation for better performance
      const [formStats, responseStats] = await Promise.all([
        Form.aggregate([
          { $match: { isPublished: true } },
          { $count: 'totalForms' }
        ]),
        Response.aggregate([
          { $match: { complete: true } },
          {
            $group: {
              _id: null,
              totalResponses: { $sum: 1 },
              certificatesSent: { $sum: { $cond: ['$cert.sent', 1, 0] } },
              responsesByDay: {
                $push: {
                  date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                  sentiment: '$sentiment.label'
                }
              }
            }
          }
        ])
      ]);

      const totalForms = formStats[0]?.totalForms || 0;
      const stats = responseStats[0] || { totalResponses: 0, certificatesSent: 0, responsesByDay: [] };
      
      const responsesByDay = stats.responsesByDay.reduce((acc, item) => {
        acc[item.date] = (acc[item.date] || 0) + 1;
        return acc;
      }, {});

      const sentimentStats = stats.responsesByDay.reduce((acc, item) => {
        const label = item.sentiment || 'unknown';
        acc[label] = (acc[label] || 0) + 1;
        return acc;
      }, {});

      // Get top 5 forms by response count
      const topForms = await Form.aggregate([
        { $match: { isPublished: true } },
        {
          $lookup: {
            from: 'responses',
            localField: '_id',
            foreignField: 'formId',
            as: 'responses'
          }
        },
        {
          $project: {
            formId: '$_id',
            title: 1,
            responseCount: { $size: '$responses' }
          }
        },
        { $sort: { responseCount: -1 } },
        { $limit: 5 }
      ]);

      return {
        overview: {
          totalForms,
          totalResponses: stats.totalResponses,
          averageResponsesPerForm: totalForms > 0 ? Math.round((stats.totalResponses / totalForms) * 100) / 100 : 0,
          certificatesSent: stats.certificatesSent
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