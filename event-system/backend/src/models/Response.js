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
  if (this.answers && this.answers.length > 0) {
    // Calculate total time spent if not already set
    if (!this.timeSpent || this.timeSpent === 0) {
      this.timeSpent = this.answers.reduce((total, answer) => {
        if (answer.startTime && answer.endTime) {
          const start = new Date(answer.startTime).getTime();
          const end = new Date(answer.endTime).getTime();
          return total + Math.floor((end - start) / 1000); // Convert to seconds
        }
        return total;
      }, 0);
    }
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
  localField: 'submittedBy',
  foreignField: '_id',
  justOne: true,
});

// Indexes for common queries
responseSchema.index({ formId: 1, submittedAt: -1 });
responseSchema.index({ 'sentiment.label': 1, formId: 1 });
responseSchema.index({ 'metadata.ipAddress': 1, formId: 1 });
responseSchema.index({ 'metadata.userAgent': 1 });
responseSchema.index({ certificateSent: 1, formId: 1 });

const Response = mongoose.model('Response', responseSchema);

export default Response;
