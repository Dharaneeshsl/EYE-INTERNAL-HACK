import { AnalyticsService } from "../services/analyticsService.js";

const getFormStatistics = async (req, res, next) => {
  try {
    const { formId } = req.params;
    const stats = await AnalyticsService.getFormStatistics(formId);
    if (global.io) {
      global.io.to(`form:${formId}`).emit("stats:update", stats);
    }
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

const getAggregatedStatistics = async (req, res, next) => {
  try {
    const stats = await AnalyticsService.getAggregatedStatistics();
    if (global.io) {
      global.io.to("analytics:global").emit("stats:update", stats);
    }
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

export { getFormStatistics, getAggregatedStatistics };
