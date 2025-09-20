import { AnalyticsService } from '../services/analyticsService.js';
import { ApiError } from '../utils/errors.js';

/**
 * Analytics controller for handling analytics-related requests
 */
export class AnalyticsController {
  /**
   * Get statistics for a specific form
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next function
   */
  static async getFormStatistics(req, res, next) {
    try {
      const { formId } = req.params;
      const stats = await AnalyticsService.getFormStatistics(formId);
      
      // Emit stats update via socket.io
      if (global.io) {
        global.io.to(`form:${formId}`).emit('stats:update', stats);
      }
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get aggregated statistics across all forms
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next function
   */
  static async getAggregatedStatistics(req, res, next) {
    try {
      const stats = await AnalyticsService.getAggregatedStatistics();
      
      // Emit stats update via socket.io
      if (global.io) {
        global.io.to('analytics:global').emit('stats:update', stats);
      }
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AnalyticsController;