import express from 'express';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';
import Event from '../models/Event.js';
import Club from '../models/Club.js';
import { ApiError } from '../utils/errors.js';

const router = express.Router();
router.use(isAuthenticated);
router.use(isAdmin);

router.post('/', async (req, res, next) => {
  try {
    const { clubId, name, description, startDate, endDate, location } = req.body;
    const club = await Club.findById(clubId);
    if (!club) throw new ApiError('Club not found', 404);
    const event = await Event.create({ clubId, name, description, startDate, endDate, location });
    res.status(201).json({ success: true, data: event });
  } catch (e) { next(e); }
});

router.get('/', async (req, res, next) => {
  try {
    const { clubId, active } = req.query;
    const q = {};
    if (clubId) q.clubId = clubId;
    if (active === 'true') q.isActive = true; if (active === 'false') q.isActive = false;
    const events = await Event.find(q).sort('-createdAt');
    res.json({ success: true, data: events });
  } catch (e) { next(e); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!event) throw new ApiError('Event not found', 404);
    res.json({ success: true, data: event });
  } catch (e) { next(e); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!event) throw new ApiError('Event not found', 404);
    res.json({ success: true, message: 'Event archived', data: event });
  } catch (e) { next(e); }
});

export default router;


