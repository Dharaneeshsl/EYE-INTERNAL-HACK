import Event from '../models/Event.js';
import Club from '../models/Club.js';
import { ApiError } from '../utils/errors.js';

export class EventService {
  static async createEvent(payload) {
    const { clubId } = payload;
    const club = await Club.findById(clubId);
    if (!club) throw new ApiError('Club not found', 404);
    const event = await Event.create(payload);
    return event;
  }

  static async listEvents(query) {
    const filter = {};
    if (query.clubId) filter.clubId = query.clubId;
    if (query.active === 'true') filter.isActive = true;
    if (query.active === 'false') filter.isActive = false;
    return Event.find(filter).sort('-createdAt');
  }

  static async updateEvent(id, update) {
    const event = await Event.findByIdAndUpdate(id, update, { new: true, runValidators: true });
    if (!event) throw new ApiError('Event not found', 404);
    return event;
  }

  static async archiveEvent(id) {
    const event = await Event.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!event) throw new ApiError('Event not found', 404);
    return event;
  }
}

export default EventService;


