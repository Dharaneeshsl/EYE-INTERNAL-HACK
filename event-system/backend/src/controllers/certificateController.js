
import Certificate from '../models/Certificate.js';
import Form from '../models/Form.js';
import Response from '../models/Response.js';
import certificateService from '../services/certificateService.js';
import { ApiError } from '../utils/errors.js';

/**
 * Certificate Controller
 * Handles all certificate-related operations
 */
export class CertificateController {
  /**
   * Create a new certificate template
   * POST /api/certificates
   * @access Private (Admin)
   */
  static createCertificate = async (req, res, next) => {
    try {
      const { formId, name, description, template, fieldMappings, emailTemplate, autoSend, autoSendDelay } = req.body;

      // Validate form exists and check for existing certificate
      const [form, existingCertificate] = await Promise.all([
        Form.findById(formId),
        Certificate.findOne({ formId })
      ]);

      if (!form) throw new ApiError('Form not found', 404);
      if (existingCertificate) throw new ApiError('Certificate already exists for this form', 400);

      // Validate template
      const isValidTemplate = await certificateService.validateTemplate(Buffer.from(template, 'base64'));
      if (!isValidTemplate) throw new ApiError('Invalid PDF template', 400);

      // Create certificate
      const certificate = await Certificate.create({
        formId,
        name,
        description,
        template,
        fieldMappings: fieldMappings || [],
        emailTemplate,
        autoSend: autoSend || false,
        autoSendDelay: autoSendDelay || 0,
        createdBy: req.user._id
      }).populate('formId', 'title');

      res.status(201).json({
        success: true,
        message: 'Certificate template created successfully',
        data: certificate
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get all certificates
   * GET /api/certificates
   * @access Private (Admin)
   */
  static getCertificates = async (req, res, next) => {
    try {
      const certificates = await Certificate.find()
        .populate('formId', 'title')
        .populate('createdBy', 'name email')
        .sort('-createdAt');

      res.json({
        success: true,
        data: certificates
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get certificate by ID
   * GET /api/certificates/:id
   * @access Private (Admin)
   */
  static getCertificate = async (req, res, next) => {
    try {
      const { id } = req.params;

      const certificate = await Certificate.findById(id)
        .populate('formId', 'title')
        .populate('createdBy', 'name email');

      if (!certificate) {
        throw new ApiError('Certificate not found', 404);
      }

      res.json({
        success: true,
        data: certificate
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update certificate
   * PUT /api/certificates/:id
   * @access Private (Admin)
   */
  static updateCertificate = async (req, res, next) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Check if certificate exists
      const certificate = await Certificate.findById(id);
      if (!certificate) {
        throw new ApiError('Certificate not found', 404);
      }

      // Validate template if provided
      if (updates.template) {
        const isValidTemplate = await certificateService.validateTemplate(
          Buffer.from(updates.template, 'base64')
        );
        if (!isValidTemplate) {
          throw new ApiError('Invalid PDF template', 400);
        }
      }

      // Update certificate
      const updatedCertificate = await Certificate.findByIdAndUpdate(
        id,
        {
          ...updates,
          updatedBy: req.user._id
        },
        { new: true, runValidators: true }
      ).populate('formId', 'title');

      res.json({
        success: true,
        message: 'Certificate updated successfully',
        data: updatedCertificate
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete certificate
   * DELETE /api/certificates/:id
   * @access Private (Admin)
   */
  static deleteCertificate = async (req, res, next) => {
    try {
      const { id } = req.params;

      const certificate = await Certificate.findById(id);
      if (!certificate) {
        throw new ApiError('Certificate not found', 404);
      }

      await Certificate.findByIdAndDelete(id);

      res.json({
        success: true,
        message: 'Certificate deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Generate certificate for a response
   * POST /api/certificates/:id/generate
   * @access Private (Admin)
   */
  static generateCertificate = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { responseId } = req.body;

      const certificate = await Certificate.findById(id);
      if (!certificate) {
        throw new ApiError('Certificate not found', 404);
      }

      const response = await Response.findById(responseId);
      if (!response) {
        throw new ApiError('Response not found', 404);
      }

      // Generate PDF
      const pdfBuffer = await certificateService.generateCertificate({
        certificateId: id,
        responseId,
        data: response.answers
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="certificate-${responseId}.pdf"`);

      res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Send certificate via email
   * POST /api/certificates/:id/send
   * @access Private (Admin)
   */
  static sendCertificate = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { responseId, recipientEmail } = req.body;

      const certificate = await Certificate.findById(id);
      if (!certificate) {
        throw new ApiError('Certificate not found', 404);
      }

      const response = await Response.findById(responseId);
      if (!response) {
        throw new ApiError('Response not found', 404);
      }

      // Generate PDF
      const pdfBuffer = await certificateService.generateCertificate({
        certificateId: id,
        responseId,
        data: response.answers
      });

      // Send email
      await certificateService.sendCertificate({
        certificateId: id,
        responseId,
        recipientEmail,
        pdfBuffer
      });

      res.json({
        success: true,
        message: 'Certificate sent successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get certificate statistics
   * GET /api/certificates/:id/stats
   * @access Private (Admin)
   */
  static getCertificateStats = async (req, res, next) => {
    try {
      const { id } = req.params;

      const certificate = await Certificate.findById(id);
      if (!certificate) {
        throw new ApiError('Certificate not found', 404);
      }

      const stats = await certificateService.getCertificateStats(id);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Batch generate certificates
   * POST /api/certificates/batch
   * @access Private (Admin)
   */
  static batchGenerateCertificates = async (req, res, next) => {
    try {
      const { certificateId, responseIds } = req.body;

      const certificate = await Certificate.findById(certificateId);
      if (!certificate) {
        throw new ApiError('Certificate not found', 404);
      }

      const results = await certificateService.generateBatchCertificates({
        certificateId,
        responseIds
      });

      res.json({
        success: true,
        message: `Processed ${results.length} certificates`,
        data: results
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Upload certificate template
   * POST /api/certificates/upload
   * @access Private (Admin)
   */
  static uploadTemplate = async (req, res, next) => {
    try {
      if (!req.file) {
        throw new ApiError('No file uploaded', 400);
      }

      // Convert file to base64
      const template = req.file.buffer.toString('base64');

      res.json({
        success: true,
        message: 'Template uploaded successfully',
        data: { template }
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Auto-send certificates for eligible responses
   * POST /api/certificates/:id/auto-send
   * @access Private (Admin)
   */
  static processAutoSend = async (req, res, next) => {
    try {
      const { id } = req.params;

      const certificate = await Certificate.findById(id);
      if (!certificate) {
        throw new ApiError('Certificate not found', 404);
      }

      if (!certificate.autoSend) {
        throw new ApiError('Auto-send is not enabled for this certificate', 400);
      }

      const results = await certificateService.processAutoSend(id);

      res.json({
        success: true,
        message: `Auto-sent ${results.sent} certificates`,
        data: results
      });
    } catch (error) {
      next(error);
    }
  };
}

export default CertificateController;
