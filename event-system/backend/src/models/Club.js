import mongoose from 'mongoose';

const clubSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, trim: true, maxlength: 500 },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

clubSchema.index({ owner: 1, name: 1 }, { unique: true });

const Club = mongoose.model('Club', clubSchema);
export default Club;


