import mongoose from 'mongoose';

const sentCertificateSchema = new mongoose.Schema({
  certificate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Certificate',
    required: true
  },
  response: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Response',
    required: true
  },
  recipientEmail: {
    type: String,
    required: true
  },
  sentAt: {
    type: Date,
    default: Date.now
  }
});

const SentCertificate = mongoose.model('SentCertificate', sentCertificateSchema);

export default SentCertificate;
