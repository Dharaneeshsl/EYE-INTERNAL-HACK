import EventService from '../services/eventService.js';

export class EventController {
  static create = async (req, res, next) => {
    try {
      const event = await EventService.createEvent(req.body);
      res.status(201).json({ success: true, data: event });
    } catch (err) {
      next(err);
    }
  };

  static list = async (req, res, next) => {
    try {
      const events = await EventService.listEvents(req.query);
      res.json({ success: true, data: events });
    } catch (err) {
      next(err);
    }
  };

  static update = async (req, res, next) => {
    try {
      const event = await EventService.updateEvent(req.params.id, req.body);
      res.json({ success: true, data: event });
    } catch (err) {
      next(err);
    }
  };

  static archive = async (req, res, next) => {
    try {
      const event = await EventService.archiveEvent(req.params.id);
      res.json({ success: true, message: 'Event archived', data: event });
    } catch (err) {
      next(err);
    }
  };
}

export default EventController;


