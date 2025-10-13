import nodemailer from 'nodemailer';
import { ApiError } from '../utils/errors.js';

/**
 * Simplified email service with template caching
 */
export class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    this.templateCache = new Map();
    this.from = `${process.env.EMAIL_FROM_NAME || 'Event System'} <${process.env.EMAIL_FROM}>`;
  }

  /**
   * Send certificate email with template caching
   */
  async sendCertificate({ to, subject, templateId, certificate, data }) {
    try {
      // Use cached template or compile new one
      let html = this.templateCache.get(templateId);
      if (!html) {
        html = this._compileTemplate(templateId, data);
        this.templateCache.set(templateId, html);
      } else {
        // Re-hydrate with data placeholders
        html = this._replaceTemplateVariables(html, data);
      }

      const info = await this.transporter.sendMail({
        from: this.from,
        to,
        subject,
        html,
        attachments: [{
          filename: 'certificate.pdf',
          content: certificate,
          contentType: 'application/pdf'
        }]
      });

      return { sent: true, id: info.messageId };
    } catch (error) {
      console.error('Email error:', error);
      return { sent: false, error: error.message };
    }
  }

  /**
   * Send notification email
   * @param {Object} options - Email options
   * @param {string} options.to - Recipient email
   * @param {string} options.subject - Email subject
   * @param {string} options.template - Email template content
   * @param {Object} options.data - Template data
   * @returns {Promise<Object>} Nodemailer send response
   */
  async sendNotification(options) {
    try {
      const { to, subject, template, data } = options;

      // Replace template variables with actual data
      const html = this._replaceTemplateVariables(template, data);

      const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME || 'Event System'}" <${process.env.EMAIL_FROM}>`,
        to,
        subject,
        html
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Notification email sent:', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending notification email:', error);
      throw new ApiError('Failed to send notification email', 500);
    }
  }

  /**
   * Replace template variables with actual data
   * @param {string} template - Email template
   * @param {Object} data - Template data
   * @returns {string} Processed template
   */
  _replaceTemplateVariables(template, data) {
    let processedTemplate = template;
    Object.entries(data).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      processedTemplate = processedTemplate.replace(regex, value);
    });
    return processedTemplate;
  }

  /**
   * Compile built-in templates with minimal logic support
   */
  _compileTemplate(templateId, data) {
    const templates = {
      certificate: `
        <div style="font-family: Arial, sans-serif; color: #222">
          <h1 style="margin-bottom: 8px">Certificate of Completion</h1>
          <p style="margin: 0 0 12px 0">Dear {{name}},</p>
          <p style="margin: 0 0 12px 0">Thank you for participating in {{formTitle}}.</p>
          <p style="margin: 0 0 12px 0">Your certificate is attached to this email.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 16px 0"/>
          <small>This is an automated message. Please do not reply.</small>
        </div>
      `
    };
    const tpl = templates[templateId] || '';
    return this._replaceTemplateVariables(tpl, data || {});
  }

  /**
   * Verify SMTP connection
   * @returns {Promise<boolean>} Connection status
   */
  async verifyConnection() {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('SMTP connection verification failed:', error);
      return false;
    }
  }
}

// Create singleton instance
const emailService = new EmailService();
export default emailService;