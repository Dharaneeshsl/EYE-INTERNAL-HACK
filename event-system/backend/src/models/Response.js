import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  qId: String,
  type: String,
  text: String,
  val: mongoose.Schema.Types.Mixed,
  skip: Boolean,
  time: {
    start: Date,
    end: { type: Date, default: Date.now }
  }
});

const responseSchema = new mongoose.Schema({
  formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  answers: [answerSchema],
  complete: { type: Boolean, default: true },
  time: Number,
  meta: {
    ua: String,
    ip: String,
    ref: String
  },
  sentiment: {
    score: { type: Number, min: -1, max: 1 },
    label: { type: String, enum: ['pos', 'neu', 'neg'] }
  },
  cert: {
    sent: Boolean,
    at: Date
  }
}, {
  timestamps: true
});

// Calculate time spent before saving
responseSchema.pre('save', function (next) {
  if (typeof this.time !== 'number' && this.answers && this.answers.length > 0) {
    const seconds = this.answers.reduce((total, answer) => {
      if (answer.time?.start && answer.time?.end) {
        const start = new Date(answer.time.start).getTime();
        const end = new Date(answer.time.end).getTime();
        return total + Math.max(0, Math.floor((end - start) / 1000));
      }
      return total;
    }, 0);
    this.time = seconds;
  }
  next();
});

// Update form's response count after saving
responseSchema.post('save', async function () {
  try {
    const Form = mongoose.model('Form');
    await Form.findByIdAndUpdate(this.formId, {
      $inc: { responseCount: 1 },
      $set: { lastResponseAt: new Date() },
    });
  } catch (error) {
    console.error('Error updating form response count:', error);
  }
});

// Virtual for form
responseSchema.virtual('form', {
  ref: 'Form',
  localField: 'formId',
  foreignField: '_id',
  justOne: true,
});

// Virtual for user
responseSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

// Indexes for common queries
responseSchema.index({ formId: 1, createdAt: -1 });
responseSchema.index({ 'sentiment.label': 1, formId: 1 });
responseSchema.index({ 'meta.ip': 1, formId: 1 });
responseSchema.index({ 'meta.ua': 1 });
responseSchema.index({ 'cert.sent': 1, formId: 1 });

const Response = mongoose.model('Response', responseSchema);

export default Response;
