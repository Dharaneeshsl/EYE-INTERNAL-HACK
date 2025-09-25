import express from 'express';
import { getFormStatistics, getAggregatedStatistics } from '../controllers/analyticsController.js';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Protect all analytics routes
router.use(isAuthenticated);

// Get statistics for a specific form
router.get('/forms/:formId', getFormStatistics);

// Get aggregated statistics (admin only)
router.get('/aggregate', isAdmin, getAggregatedStatistics);

// Backward-compatible alias used by frontend: GET /api/analytics/stats
router.get('/stats', isAdmin, async (req, res, next) => {
  try {
    const data = await getAggregatedStatistics(req, res, next);
    // getAggregatedStatistics already sends response; only send if not sent
    if (!res.headersSent) {
      res.json(data);
    }
  } catch (e) {
    next(e);
  }
});

export default router;