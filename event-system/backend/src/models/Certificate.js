import mongoose from 'mongoose';

const fieldMappingSchema = new mongoose.Schema({
  formField: {
    type: String,
    required: [true, 'Form field is required'],
    trim: true,
  },
  pdfField: {
    type: String,
    required: [true, 'PDF field is required'],
    trim: true,
  },
  fieldType: {
    type: String,
    enum: ['text', 'image', 'date', 'signature'],
    default: 'text',
  },
  position: {
    x: {
      type: Number,
      required: [true, 'X position is required'],
      min: 0,
    },
    y: {
      type: Number,
      required: [true, 'Y position is required'],
      min: 0,
    },
    page: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  style: {
    font: {
      type: String,
      default: 'Helvetica',
    },
    size: {
      type: Number,
      default: 12,
      min: 6,
      max: 72,
    },
    color: {
      type: String,
      default: '#000000',
      match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color code'],
    },
    bold: {
      type: Boolean,
      default: false,
    },
    italic: {
      type: Boolean,
      default: false,
    },
    alignment: {
      type: String,
      enum: ['left', 'center', 'right'],
      default: 'left',
    },
    maxWidth: {
      type: Number,
      min: 0,
    },
    maxHeight: {
      type: Number,
      min: 0,
    },
  },
});

const emailTemplateSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: [true, 'Email subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot be more than 200 characters'],
  },
  body: {
    type: String,
    required: [true, 'Email body is required'],
    trim: true,
  },
  fromName: {
    type: String,
    trim: true,
    default: 'Event Feedback System',
  },
  fromEmail: {
    type: String,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
  },
  replyTo: {
    type: String,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
  },
  cc: [
    {
      type: String,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
    },
  ],
  bcc: [
    {
      type: String,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
    },
  ],
  attachments: [
    {
      filename: String,
      content: String, // base64 encoded content
      contentType: String,
    },
  ],
});

const certificateSchema = new mongoose.Schema(
  {
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Form',
      required: [true, 'Form ID is required'],
      index: true,
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Certificate name is required'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    template: {
      type: String, // Base64 encoded PDF
      required: [true, 'Certificate template is required'],
    },
    templateUrl: {
      type: String,
      trim: true,
    },
    pageSize: {
      type: String,
      enum: ['A4', 'LETTER', 'LEGAL', 'A3', 'A5'],
      default: 'A4',
    },
    pageOrientation: {
      type: String,
      enum: ['portrait', 'landscape'],
      default: 'portrait',
    },
    fieldMappings: [fieldMappingSchema],
    emailTemplate: emailTemplateSchema,
    isActive: {
      type: Boolean,
      default: true,
    },
    autoSend: {
      type: Boolean,
      default: false,
    },
    autoSendDelay: {
      // in minutes
      type: Number,
      default: 0,
      min: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for form
certificateSchema.virtual('form', {
  ref: 'Form',
  localField: 'formId',
  foreignField: '_id',
  justOne: true,
});

// Indexes
certificateSchema.index({ isActive: 1 });

const Certificate = mongoose.model('Certificate', certificateSchema);

export default Certificate;
