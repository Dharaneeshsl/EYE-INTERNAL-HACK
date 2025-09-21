import mongoose from 'mongoose';
const { Schema } = mongoose;

const questionSchema = new Schema({
  qId: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['text', 'textarea', 'radio', 'checkbox', 'dropdown', 'rating', 'scale', 'date', 'email'],
    required: true
  },
  text: { type: String, required: true },
  desc: String,
  req: { type: Boolean, default: false },
  opts: [{ val: String, lbl: String }],
  valid: { min: Number, max: Number, pat: String },
  ord: { type: Number, index: true },
  cond: {
    dep: String,
    op: { type: String, enum: ['eq', 'neq'] },
    val: Schema.Types.Mixed
  }
});

const formSettingsSchema = new mongoose.Schema({
  requiresLogin: Boolean,
  isAnonymous: Boolean,
  allowMultipleResponses: { type: Boolean, default: true },
  startDate: Date,
  endDate: Date,
  isActive: { type: Boolean, default: true },
  showUI: {
    progressBar: { type: Boolean, default: true },
    questionNumbers: { type: Boolean, default: true },
    timer: Boolean
  },
  timerLimit: Number,
  theme: {
    primaryColor: String,
    secondaryColor: String
  },
  confirmationMessage: String,
  redirectUrl: String
});

const formSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9-]+$/, 'Slug can only contain letters, numbers, and hyphens'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    questions: [questionSchema],
    settings: {
      type: formSettingsSchema,
      default: () => ({}),
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    responseCount: {
      type: Number,
      default: 0,
    },
    lastResponseAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Generate slug before saving
formSchema.pre('save', async function (next) {
  if (!this.isModified('title')) return next();

  // Generate slug from title
  this.slug = this.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens

  // Make slug unique if it already exists
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const formsWithSlug = await this.constructor.find({ slug: slugRegEx });
  
  if (formsWithSlug.length) {
    this.slug = `${this.slug}-${formsWithSlug.length + 1}`;
  }
  
  next();
});

// Update publishedAt when form is published
formSchema.pre('save', function (next) {
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Virtual for responses
formSchema.virtual('responses', {
  ref: 'Response',
  foreignField: 'formId',
  localField: '_id',
});

// Virtual for certificates
formSchema.virtual('certificate', {
  ref: 'Certificate',
  foreignField: 'formId',
  localField: '_id',
  justOne: true,
});

// Indexes
formSchema.index({ createdBy: 1, isPublished: 1 });
formSchema.index({ slug: 1 }, { unique: true });
formSchema.index({ tags: 1 });
formSchema.index({ 'settings.isActive': 1 });
formSchema.index({ 'settings.startDate': 1, 'settings.endDate': 1 });

const Form = mongoose.model('Form', formSchema);

export default Form;
