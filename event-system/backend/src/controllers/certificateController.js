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

      // Validate form exists
      const form = await Form.findById(formId);
      if (!form) {
        throw new ApiError('Form not found', 404);
      }

      // Check if certificate already exists for this form
      const existingCertificate = await Certificate.findOne({ formId });
      if (existingCertificate) {
        throw new ApiError('Certificate already exists for this form', 400);
      }

      // Validate template
      const isValidTemplate = await certificateService.validateTemplate(
        Buffer.from(template, 'base64')
      );
      if (!isValidTemplate) {
        throw new ApiError('Invalid PDF template', 400);
      }

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
      });

      // Populate form data
      await certificate.populate('formId', 'title');

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

