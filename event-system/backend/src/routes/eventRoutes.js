import express from 'express';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';
import { body, query } from 'express-validator';
import { EventController } from '../controllers/eventController.js';
import validate from '../middleware/validate.js';

const router = express.Router();
router.use(isAuthenticated);
router.use(isAdmin);

router.post(
  '/',
  [
    body('clubId').isString().notEmpty(),
    body('name').isString().trim().notEmpty(),
    body('description').optional().isString(),
    body('startDate').optional().isISO8601(),
    body('endDate').optional().isISO8601(),
    body('location').optional().isString()
  ],
  validate,
  EventController.create
);

router.get(
  '/',
  [
    query('clubId').optional().isString(),
    query('active').optional().isIn(['true', 'false'])
  ],
  validate,
  EventController.list
);

router.put(
  '/:id',
  [
    body('name').optional().isString().trim(),
    body('description').optional().isString(),
    body('startDate').optional().isISO8601(),
    body('endDate').optional().isISO8601(),
    body('location').optional().isString(),
    body('isActive').optional().isBoolean()
  ],
  validate,
  EventController.update
);

router.delete('/:id', EventController.archive);

export default router;


