import express from 'express';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';
import { uploadCertificateTemplate, handleUploadError } from '../middleware/upload.js';
import { CertificateController } from '../controllers/certificateController.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(isAuthenticated);
router.use(isAdmin);

/**
 * @route   POST /api/certificates
 * @desc    Create a new certificate template
 * @access  Private (Admin)
 */
router.post(
  '/',
  (req, res, next) => {
    // Handle file upload
    uploadCertificateTemplate('template')(req, res, (err) => {
      if (err) {
        return next(err);
      }

      // Convert uploaded file to base64 if present
      if (req.file) {
        req.body.template = req.file.buffer.toString('base64');
      }

      next();
    });
  },
  handleUploadError,
  CertificateController.createCertificate
);

/**
 * @route   GET /api/certificates
 * @desc    Get all certificates
 * @access  Private (Admin)
 */
router.get('/', CertificateController.getCertificates);

/**
 * @route   GET /api/certificates/:id
 * @desc    Get certificate by ID
 * @access  Private (Admin)
 */
router.get('/:id', CertificateController.getCertificate);

/**
 * @route   PUT /api/certificates/:id
 * @desc    Update certificate
 * @access  Private (Admin)
 */
router.put(
  '/:id',
  (req, res, next) => {
    // Handle file upload for template updates
    uploadCertificateTemplate('template')(req, res, (err) => {
      if (err) {
        return next(err);
      }

      // Convert uploaded file to base64 if present
      if (req.file) {
        req.body.template = req.file.buffer.toString('base64');
      }

      next();
    });
  },
  handleUploadError,
  CertificateController.updateCertificate
);

/**
 * @route   DELETE /api/certificates/:id
 * @desc    Delete certificate
 * @access  Private (Admin)
 */
router.delete('/:id', CertificateController.deleteCertificate);

/**
 * @route   POST /api/certificates/:id/generate
 * @desc    Generate certificate for a response
 * @access  Private (Admin)
 */
router.post('/:id/generate', CertificateController.generateCertificate);

/**
 * @route   POST /api/certificates/:id/send
 * @desc    Send certificate via email
 * @access  Private (Admin)
 */
router.post('/:id/send', CertificateController.sendCertificate);

/**
 * @route   POST /api/certificates/:id/batch-generate
 * @desc    Batch generate certificates
 * @access  Private (Admin)
 */
router.post('/:id/batch-generate', CertificateController.batchGenerateCertificates);

/**
 * @route   POST /api/certificates/:id/auto-send
 * @desc    Process auto-send certificates
 * @access  Private (Admin)
 */
router.post('/:id/auto-send', CertificateController.processAutoSend);

/**
 * @route   GET /api/certificates/:id/stats
 * @desc    Get certificate statistics
 * @access  Private (Admin)
 */
router.get('/:id/stats', CertificateController.getCertificateStats);

/**
 * @route   POST /api/certificates/:id/upload-template
 * @desc    Upload certificate template
 * @access  Private (Admin)
 */
router.post(
  '/:id/upload-template',
  uploadCertificateTemplate('template'),
  handleUploadError,
  async (req, res, next) => {
    try {
      if (!req.file) {
        throw new ApiError('No file uploaded', 400);
      }

      const { id } = req.params;
      const template = req.file.buffer.toString('base64');

      // Update certificate template
      const updatedCertificate = await Certificate.findByIdAndUpdate(
        id,
        { template, updatedBy: req.user._id },
        { new: true }
      ).populate('formId', 'title');

      res.json({
        success: true,
        message: 'Template uploaded successfully',
        data: updatedCertificate
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
