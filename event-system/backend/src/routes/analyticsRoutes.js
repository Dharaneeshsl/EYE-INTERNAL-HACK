import express from 'express';
import { analyticsController } from '../controllers/analyticsController.js';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Protect all analytics routes
router.use(isAuthenticated);

// Get statistics for a specific form
router.get('/forms/:formId', analyticsController.getFormStatistics);

// Get aggregated statistics (admin only)
router.get('/aggregate', isAdmin, analyticsController.getAggregatedStatistics);

export default router;