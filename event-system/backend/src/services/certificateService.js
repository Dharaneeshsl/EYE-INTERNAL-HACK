import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import Certificate from '../models/Certificate.js';
import Response from '../models/Response.js';
import SentCertificate from '../models/SentCertificate.js';
import emailService from './emailService.js';
import { ApiError } from '../utils/errors.js';

export class CertificateService {
  constructor() {
    this.fontCache = new Map();
  }

  async generateCertificate({ certificateId, responseId, data }) {
    try {
      const certificate = await Certificate.findById(certificateId)
        .populate('formId', 'title');

      if (!certificate) {
        throw new ApiError('Certificate template not found', 404);
      }

      const response = await Response.findById(responseId)
        .populate('user', 'name email');

      if (!response) {
        throw new ApiError('Response not found', 404);
      }

      const pdfDoc = await PDFDocument.load(Buffer.from(certificate.template, 'base64'));
      const page = pdfDoc.getPages()[0];
      const { width, height } = page.getSize();
      const font = await this.getFont(certificate.fieldMappings);

      for (const mapping of certificate.fieldMappings) {
        const value = this.getFieldValue(mapping.formField, data, response);
        if (value) {
          await this.applyFieldMapping(page, mapping, value, font, width, height);
        }
      }

      const pdfBytes = await pdfDoc.save();
      return Buffer.from(pdfBytes);
    } catch (error) {
      console.error('Certificate generation error:', error);
      throw new ApiError('Failed to generate certificate', 500);
    }
  }

  async generateBatchCertificates({ certificateId, responseIds }) {
    const results = await Promise.allSettled(
      responseIds.map(async (responseId) => {
        try {
          const pdfBuffer = await this.generateCertificate({ certificateId, responseId });
          return { responseId, success: true, pdfBuffer, error: null };
        } catch (error) {
          return { responseId, success: false, pdfBuffer: null, error: error.message };
        }
      })
    );
    return results.map(result => result.value || result.reason);
  }

  async generatePreview(certificateId) {
    try {
      const certificate = await Certificate.findById(certificateId).populate('formId', 'title');
      if (!certificate) {
        throw new ApiError('Certificate template not found', 404);
      }

      const pdfDoc = await PDFDocument.load(Buffer.from(certificate.template, 'base64'));
      const page = pdfDoc.getPages()[0];
      const { width, height } = page.getSize();
      const font = await this.getFont(certificate.fieldMappings);

      // Use placeholder/sample values for preview
      for (const mapping of certificate.fieldMappings) {
        const sampleValue = mapping.pdfField || mapping.formField || 'Sample Text';
        await this.applyFieldMapping(page, mapping, sampleValue, font, width, height);
      }

      const pdfBytes = await pdfDoc.save();
      return Buffer.from(pdfBytes);
    } catch (error) {
      console.error('Certificate preview error:', error);
      throw new ApiError('Failed to generate certificate preview', 500);
    }
  }

  async sendCertificate({ certificateId, responseId, recipientEmail, pdfBuffer }) {
    try {
      const certificate = await Certificate.findById(certificateId).populate('formId', 'title');
      if (!certificate) {
        throw new ApiError('Certificate not found', 404);
      }

      const subject = certificate.emailTemplate?.subject || `Your Certificate for ${certificate.formId.title}`;
      const emailData = {
        name: recipientEmail,
        formTitle: certificate.formId.title
      };

      const result = await emailService.sendCertificate({
        to: recipientEmail,
        subject: subject,
        templateId: 'certificate',
        certificate: pdfBuffer,
        data: emailData,
      });

      if (result.sent) {
        await SentCertificate.create({
          certificate: certificateId,
          response: responseId,
          recipientEmail: recipientEmail,
        });
      }

      return result;
    } catch (error) {
      console.error('Certificate email error:', error);
      throw new ApiError('Failed to send certificate email', 500);
    }
  }

  async processAutoSend(certificateId) {
    try {
      const certificate = await Certificate.findById(certificateId);
      if (!certificate || !certificate.autoSend) {
        return { processed: 0, sent: 0, errors: 0 };
      }

      const delay = certificate.autoSendDelay || 0;
      const responses = await Response.find({
        formId: certificate.formId,
        createdAt: { $lte: new Date(Date.now() - delay * 60 * 1000) }
      }).populate('user', 'name email');

      let sent = 0;
      let errors = 0;

      for (const response of responses) {
        try {
          const existingSent = await this.getSentCertificate(certificateId, response._id);
          if (existingSent) continue;

          const pdfBuffer = await this.generateCertificate({
            certificateId,
            responseId: response._id,
            data: response.answers
          });

          const emailResult = await this.sendCertificate({
            certificateId,
            responseId: response._id,
            recipientEmail: response.user?.email,
            pdfBuffer,
          });

          if (emailResult.sent) {
            sent++;
          } else {
            errors++;
          }
        } catch (error) {
          console.error(`Error processing certificate for response ${response._id}:`, error);
          errors++;
        }
      }

      return { processed: responses.length, sent, errors };
    } catch (error) {
      console.error('Auto-send processing error:', error);
      throw new ApiError('Failed to process auto-send certificates', 500);
    }
  }

  async getFont(fieldMappings) {
    const fontKey = 'default';
    if (this.fontCache.has(fontKey)) {
      return this.fontCache.get(fontKey);
    }
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    this.fontCache.set(fontKey, font);
    return font;
  }

  async applyFieldMapping(page, mapping, value, font, pageWidth, pageHeight) {
    const { position, style, maxWidth } = mapping;
    const x = position.x;
    const y = pageHeight - position.y - (style.size || 12);
    const color = this.parseColor(style.color || '#000000');
    let fontSize = style.size || 12;
    let textWidth = font.widthOfTextAtSize(value, fontSize);
    const maxAllowedWidth = maxWidth || 200; // Default max width if not specified

    // Shrink font size until text fits within maxAllowedWidth
    while (textWidth > maxAllowedWidth && fontSize > 6) {
      fontSize--;
      textWidth = font.widthOfTextAtSize(value, fontSize);
    }

    page.drawText(value, {
      x, y, font,
      size: fontSize,
      color: rgb(color.r, color.g, color.b),
    });
  }

  parseColor(color) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    return { r, g, b };
  }

  getFieldValue(formField, data, response) {
    // If answers come as an array of objects [{ qId, val, text }]
    if (Array.isArray(data)) {
      const match = data.find(a => a.qId === formField || a.name === formField);
      if (match) return match.val || match.text || '';
    }
    if (data && data[formField]) {
      return data[formField];
    }
    if (response.user) {
      switch (formField) {
        case 'name': return response.user.name;
        case 'email': return response.user.email;
        default: return '';
      }
    }
    return '';
  }

  async getSentCertificate(certificateId, responseId) {
    return SentCertificate.findOne({ certificate: certificateId, response: responseId });
  }

  async getCertificateStats(certificateId) {
    const sent = await SentCertificate.find({ certificate: certificateId }).lean();
    const stats = {
      totalGenerated: sent.length,
      totalSent: sent.length,
      totalPending: 0,
      sentByDate: {},
      failedDeliveries: []
    };
    for (const s of sent) {
      const date = (s.sentAt || s.createdAt)?.toISOString().split('T')[0];
      if (date) stats.sentByDate[date] = (stats.sentByDate[date] || 0) + 1;
    }
    return stats;
  }

  async validateTemplate(templateBuffer) {
    try {
      const pdfDoc = await PDFDocument.load(templateBuffer);
      return pdfDoc.getPageCount() > 0;
    } catch (error) {
      return false;
    }
  }
}

const certificateService = new CertificateService();
export default certificateService;
