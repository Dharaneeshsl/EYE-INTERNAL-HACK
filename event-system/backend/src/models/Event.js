import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  clubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: false, index: true },
  name: { type: String, required: true, trim: true, maxlength: 150 },
  slug: { type: String, trim: true, lowercase: true, unique: true },
  description: { type: String, trim: true, maxlength: 1000 },
  startDate: { type: Date },
  endDate: { type: Date },
  location: { type: String, trim: true, maxlength: 200 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

eventSchema.pre('save', function(next) {
  if (!this.isModified('name')) return next();
  const base = this.name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  this.slug = base;
  next();
});

eventSchema.index({ clubId: 1, name: 1 }, { unique: true });

const Event = mongoose.model('Event', eventSchema);
export default Event;


