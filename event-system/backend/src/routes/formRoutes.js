import express from 'express';
import QRCode from 'qrcode';
import { Parser } from 'json2csv';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';
import Form from '../models/Form.js';
import Response from '../models/Response.js';
import Certificate from '../models/Certificate.js';
import certificateService from '../services/certificateService.js';
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

    // Auto-generate and send certificate if enabled for this form
    try {
      const certificate = await Certificate.findOne({ formId: form._id, isActive: true });
      if (certificate?.autoSend) {
        const pdfBuffer = await certificateService.generateCertificate({
          certificateId: certificate._id,
          responseId: response._id,
          data: response.answers
        });

        // Determine recipient email: prefer populated user email, else look for email answer
        let recipientEmail = req.user?.email;
        if (!recipientEmail && Array.isArray(response.answers)) {
          const emailAns = response.answers.find(a => a.type === 'email' || a.qId?.toLowerCase().includes('email'));
          if (emailAns?.text) recipientEmail = emailAns.text;
          if (emailAns?.val && typeof emailAns.val === 'string') recipientEmail = emailAns.val;
        }

        if (recipientEmail) {
          const sendResult = await certificateService.sendCertificate({
            certificateId: certificate._id,
            responseId: response._id,
            recipientEmail,
            pdfBuffer
          });

          if (sendResult.sent) {
            response.cert = { sent: true, at: new Date() };
            await response.save();
          }
        }
      }
    } catch (autoErr) {
      // Log but do not fail submission
      console.error('Auto-send certificate error:', autoErr);
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

/**
 * Export responses as CSV
 * GET /api/forms/:id/export
 * @access Private (Admin)
 */
router.get('/:id/export', isAuthenticated, isAdmin, async (req, res, next) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) throw new ApiError('Form not found', 404);

    const responses = await Response.find({ formId: req.params.id }).sort('createdAt');

    // Flatten answers into key-value pairs per response
    const rows = responses.map(r => {
      const base = {
        responseId: r._id.toString(),
        formId: r.formId.toString(),
        userId: r.userId?.toString() || '',
        createdAt: r.createdAt?.toISOString() || '',
        time: r.time || 0,
        certSent: r.cert?.sent || false,
        certAt: r.cert?.at ? r.cert.at.toISOString() : ''
      };

      if (Array.isArray(r.answers)) {
        r.answers.forEach(ans => {
          const key = ans.qId || ans.text || `q_${Math.random().toString(36).slice(2, 8)}`;
          const val = ans.val ?? ans.text ?? '';
          base[key] = typeof val === 'object' ? JSON.stringify(val) : val;
        });
      }

      return base;
    });

    const parser = new Parser({ withBOM: true });
    const csv = parser.parse(rows);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="form-${form._id}-responses.csv"`);
    res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
});

export default router;