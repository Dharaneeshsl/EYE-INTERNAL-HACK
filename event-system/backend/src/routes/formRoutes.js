import express from 'express';
import QRCode from 'qrcode';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';
import Form from '../models/Form.js';
import Response from '../models/Response.js';
import { ApiError } from '../utils/errors.js';

const router = express.Router();

const handleAsync = fn => (req, res, next) => fn(req, res, next).catch(next);

// Simplified form operations
router.post('/', isAuthenticated, isAdmin, handleAsync(async (req, res) => {
  const form = await Form.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json({ data: form });
}));

// Simplified form retrieval
router.get('/', isAuthenticated, isAdmin, handleAsync(async (req, res) => {
  const forms = await Form.find().select('title createdAt responseCount').sort('-createdAt');
  res.json({ data: forms });
}));

router.get('/:id', handleAsync(async (req, res) => {
  const form = await Form.findById(req.params.id).select('-settings.redirectUrl');
  if (!form) throw new ApiError('Form not found', 404);
  if (form.settings?.requiresLogin && !req.user) throw new ApiError('Auth required', 401);
  res.json({ data: form });
}));

/**
 * Update a form
 * PUT /api/forms/:id
 * @access Private (Admin)
 */
router.put('/:id', isAuthenticated, isAdmin, async (req, res, next) => {
  try {
    const form = await Form.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!form) {
      throw new ApiError('Form not found', 404);
    }

    res.json({
      success: true,
      data: form
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Delete a form
 * DELETE /api/forms/:id
 * @access Private (Admin)
 */
router.delete('/:id', isAuthenticated, isAdmin, async (req, res, next) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      throw new ApiError('Form not found', 404);
    }

    // Delete all responses
    await Response.deleteMany({ formId: form._id });
    await form.remove();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Submit a form response
 * POST /api/forms/:id/submit
 * @access Public/Private (based on form settings)
 */
router.post('/:id/submit', async (req, res, next) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      throw new ApiError('Form not found', 404);
    }

    // Check if form requires authentication
    if (form.settings?.requiresLogin && !req.user) {
      throw new ApiError('Authentication required to submit this form', 401);
    }

    // Create response
    const response = await Response.create({
      formId: form._id,
      userId: req.user?._id,
      answers: req.body.answers,
      complete: true,
      time: req.body.time,
      meta: {
        ua: req.headers['user-agent'],
        ip: req.ip,
        ref: req.headers.referer
      }
    });

    // Emit response via Socket.io
    if (global.io) {
      global.io.to(`form:${form._id}`).emit('response:new', {
        formId: form._id,
        responseId: response._id
      });
    }

    res.status(201).json({
      success: true,
      data: response
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Generate QR code for a form
 * GET /api/forms/:id/qr
 * @access Private (Admin)
 */
router.get('/:id/qr', isAuthenticated, isAdmin, async (req, res, next) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      throw new ApiError('Form not found', 404);
    }

    const formUrl = `${process.env.FRONTEND_URL}/forms/${form.slug || form._id}`;
    const qrCode = await QRCode.toDataURL(formUrl);

    res.json({
      success: true,
      data: {
        qrCode,
        url: formUrl
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get form responses
 * GET /api/forms/:id/responses
 * @access Private (Admin)
 */
router.get('/:id/responses', isAuthenticated, isAdmin, async (req, res, next) => {
  try {
    const responses = await Response.find({ formId: req.params.id })
      .populate('submittedBy', 'name email')
      .sort('-createdAt');

    res.json({
      success: true,
      data: responses
    });
  } catch (error) {
    next(error);
  }
});

export default router;