import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Certificate from '../models/Certificate.js';
import Response from '../models/Response.js';
import emailService from './emailService.js';
import { ApiError } from '../utils/errors.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Certificate Service for PDF generation and management
 */
export class CertificateService {
  constructor() {
    this.fontCache = new Map();
  }

  /**
   * Generate a single certificate PDF
   * @param {Object} options - Certificate generation options
   * @param {string} options.certificateId - Certificate template ID
   * @param {string} options.responseId - Response ID
   * @param {Object} options.data - Field mapping data
   * @returns {Promise<Buffer>} Generated PDF buffer
   */
  async generateCertificate({ certificateId, responseId, data }) {
    try {
      // Get certificate template
      const certificate = await Certificate.findById(certificateId)
        .populate('formId', 'title');

      if (!certificate) {
        throw new ApiError('Certificate template not found', 404);
      }

      // Get response data
      const response = await Response.findById(responseId)
        .populate('submittedBy', 'name email');

      if (!response) {
        throw new ApiError('Response not found', 404);
      }

      // Load PDF template
      const pdfDoc = await PDFDocument.load(Buffer.from(certificate.template, 'base64'));

      // Get the first page
      const page = pdfDoc.getPages()[0];
      const { width, height } = page.getSize();

      // Load font
      const font = await this.getFont(certificate.fieldMappings);

      // Apply field mappings
      for (const mapping of certificate.fieldMappings) {
        const value = this.getFieldValue(mapping.formField, data, response);
        if (value) {
          await this.applyFieldMapping(page, mapping, value, font, width, height);
        }
      }

      // Serialize PDF
      const pdfBytes = await pdfDoc.save();
      return Buffer.from(pdfBytes);
    } catch (error) {
      console.error('Certificate generation error:', error);
      throw new ApiError('Failed to generate certificate', 500);
    }
  }

  /**
   * Generate certificates in batch
   * @param {Object} options - Batch generation options
   * @param {string} options.certificateId - Certificate template ID
   * @param {Array<string>} options.responseIds - Array of response IDs
   * @param {Object} options.data - Field mapping data
   * @returns {Promise<Array<Object>>} Array of generation results
   */
  async generateBatchCertificates({ certificateId, responseIds, data }) {
    const results = [];

    for (const responseId of responseIds) {
      try {
        const pdfBuffer = await this.generateCertificate({
          certificateId,
          responseId,
          data
        });

        results.push({
          responseId,
          success: true,
          pdfBuffer,
          error: null
        });
      } catch (error) {
        results.push({
          responseId,
          success: false,
          pdfBuffer: null,
          error: error.message
        });
      }
    }

    return results;
  }

  /**
   * Send certificate via email
   * @param {Object} options - Email options
   * @param {string} options.to - Recipient email
   * @param {string} options.subject - Email subject
   * @param {Buffer} options.certificateBuffer - Certificate PDF buffer
   * @param {Object} options.templateData - Email template data
   * @returns {Promise<Object>} Email send result
   */
  async sendCertificateEmail({ to, subject, certificateBuffer, templateData }) {
    try {
      const result = await emailService.sendCertificate({
        to,
        subject,
        templateId: 'certificate',
        certificate: certificateBuffer,
        data: templateData
      });

      return result;
    } catch (error) {
      console.error('Certificate email error:', error);
      throw new ApiError('Failed to send certificate email', 500);
    }
  }

  /**
   * Process auto-send certificates
   * @param {string} certificateId - Certificate template ID
   * @returns {Promise<Object>} Processing results
   */
  async processAutoSend(certificateId) {
    try {
      const certificate = await Certificate.findById(certificateId);

      if (!certificate || !certificate.autoSend) {
        return { processed: 0, sent: 0, errors: 0 };
      }

      // Get eligible responses
      const responses = await Response.find({
        formId: certificate.formId,
        createdAt: {
          $lte: new Date(Date.now() - certificate.autoSendDelay * 60 * 1000)
        }
      }).populate('submittedBy', 'name email');

      let sent = 0;
      let errors = 0;

      for (const response of responses) {
        try {
          // Check if certificate already sent
          const existingSent = await this.getSentCertificate(certificateId, response._id);
          if (existingSent) continue;

          // Generate certificate
          const pdfBuffer = await this.generateCertificate({
            certificateId,
            responseId: response._id,
            data: response.answers
          });

          // Send email
          const emailResult = await this.sendCertificateEmail({
            to: response.submittedBy.email,
            subject: certificate.emailTemplate.subject,
            certificateBuffer: pdfBuffer,
            templateData: {
              name: response.submittedBy.name,
              formTitle: certificate.form?.title || 'Event Feedback'
            }
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

  /**
   * Get font based on field mappings
   * @param {Array} fieldMappings - Field mappings array
   * @returns {Promise<PDFFont>} Font object
   */
  async getFont(fieldMappings) {
    // Check if we have a cached font
    const fontKey = 'default';
    if (this.fontCache.has(fontKey)) {
      return this.fontCache.get(fontKey);
    }

    // Load and cache the font
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    this.fontCache.set(fontKey, font);

    return font;
  }

  /**
   * Apply field mapping to PDF page
   * @param {PDFPage} page - PDF page
   * @param {Object} mapping - Field mapping
   * @param {string} value - Field value
   * @param {PDFFont} font - Font object
   * @param {number} pageWidth - Page width
   * @param {number} pageHeight - Page height
   */
  async applyFieldMapping(page, mapping, value, font, pageWidth, pageHeight) {
    const { position, style } = mapping;

    // Calculate actual position (flip Y coordinate for PDF)
    const x = position.x;
    const y = pageHeight - position.y - (style.size || 12);

    // Set font color
    const color = this.parseColor(style.color || '#000000');

    // Draw text
    page.drawText(value, {
      x,
      y,
      font,
      size: style.size || 12,
      color: rgb(color.r, color.g, color.b),
    });
  }

  /**
   * Parse color string to RGB values
   * @param {string} color - Color string (hex format)
   * @returns {Object} RGB values
   */
  parseColor(color) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    return { r, g, b };
  }

  /**
   * Get field value from response data
   * @param {string} formField - Form field name
   * @param {Object} data - Response data
   * @param {Object} response - Response object
   * @returns {string} Field value
   */
  getFieldValue(formField, data, response) {
    // Try to get from response answers first
    if (data && data[formField]) {
      return data[formField];
    }

    // Try to get from user data
    if (response.submittedBy) {
      switch (formField) {
        case 'name':
          return response.submittedBy.name;
        case 'email':
          return response.submittedBy.email;
        default:
          return '';
      }
    }

    return '';
  }

  /**
   * Get sent certificate record
   * @param {string} certificateId - Certificate ID
   * @param {string} responseId - Response ID
   * @returns {Promise<Object|null>} Sent certificate record
   */
  async getSentCertificate(certificateId, responseId) {
    // This would typically be stored in a separate collection
    // For now, return null to indicate not sent
    return null;
  }

  /**
   * Validate certificate template
   * @param {Buffer} templateBuffer - Template buffer
   * @returns {Promise<boolean>} Validation result
   */
  async validateTemplate(templateBuffer) {
    try {
      const pdfDoc = await PDFDocument.load(templateBuffer);
      return pdfDoc.getPageCount() > 0;
    } catch (error) {
      return false;
    }
  }
}

// Create singleton instance
const certificateService = new CertificateService();
export default certificateService;
