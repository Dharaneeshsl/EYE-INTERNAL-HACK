import express from 'express';
import mongoose from 'mongoose';
import QRCode from 'qrcode';
import { Parser } from 'json2csv';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';
import Form from '../models/Form.js';
import Response from '../models/Response.js';
import Certificate from '../models/Certificate.js';
import User from '../models/User.js';
import SentCertificate from '../models/SentCertificate.js';
import certificateService from '../services/certificateService.js';
import { ApiError } from '../utils/errors.js';
import { body, param } from 'express-validator';
import validate from '../middleware/validate.js';
import { FormController } from '../controllers/formController.js';

const router = express.Router();

const handleAsync = fn => (req, res, next) => fn(req, res, next).catch(next);

// Simplified form operations
// Allow any authenticated user to create forms (was admin-only)
router.post(
  '/',
  isAuthenticated,
  [
    body('title').isString().trim().notEmpty(),
    body('description').optional().isString(),
    body('settings').optional().isObject(),
    body('questions').optional()
  ],
  validate,
  FormController.create
);

// Simplified form retrieval
// Allow any authenticated user to list forms (consider scoping by owner later)
router.get('/', isAuthenticated, FormController.list);

router.get('/:id', [param('id').isString().notEmpty()], validate, FormController.get);

/**
 * Update a form
 * PUT /api/forms/:id
 * @access Private (Admin)
 */
router.put(
  '/:id',
  isAuthenticated,
  isAdmin,
  [
    param('id').isString().notEmpty(),
    body('title').optional().isString(),
    body('description').optional().isString(),
    body('settings').optional().isObject()
  ],
  validate,
  FormController.update
);

/**
 * Delete a form
 * DELETE /api/forms/:id
 * @access Private (Admin)
 */
// Allow owner or admin to delete
router.delete('/:id', isAuthenticated, [param('id').isString().notEmpty()], validate, FormController.remove);

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
        // Determine recipient email from form answer only
        let recipientEmail = null;
        if (Array.isArray(response.answers)) {
          const emailAns = response.answers.find(a => a.type === 'email' || a.qId?.toLowerCase().includes('email'));
          if (emailAns?.text) recipientEmail = String(emailAns.text).trim();
          if (emailAns?.val && typeof emailAns.val === 'string') recipientEmail = String(emailAns.val).trim();
        }

        // Determine attendee name/email from DB user if available
        let attendeeName = undefined;
        let dbEmail = undefined;
        if (req.user?.id) {
          const dbUser = await User.findById(req.user.id).select('name email');
          attendeeName = dbUser?.name;
          dbEmail = dbUser?.email;
        }

        // Require email match between form and DB (when DB email exists)
        if (dbEmail && recipientEmail && dbEmail.toLowerCase() !== recipientEmail.toLowerCase()) {
          // Do not send if mismatch; silently accept submission
          return res.status(201).json({ success: true, data: response });
        }

        // Ensure only one certificate per attendee (by certificate + recipientEmail)
        if (recipientEmail) {
          const alreadySent = await SentCertificate.findOne({ certificate: certificate._id, recipientEmail }).lean();
          if (alreadySent) {
            return res.status(201).json({ success: true, data: response });
          }
        }

        // Merge attendee name from DB into data for rendering
        const mergedAnswers = Array.isArray(response.answers) ? [...response.answers] : [];
        if (attendeeName) {
          mergedAnswers.push({ qId: 'attendee_name', text: attendeeName, val: attendeeName, type: 'text' });
        }

        if (recipientEmail) {
          const pdfBuffer = await certificateService.generateCertificate({
            certificateId: certificate._id,
            responseId: response._id,
            data: mergedAnswers
          });
          const sendResult = await certificateService.sendCertificate({
            certificateId: certificate._id,
            responseId: response._id,
            recipientEmail,
            pdfBuffer
          });

          if (sendResult.sent) {
            response.cert = { sent: true, at: new Date() };
            await response.save();
            await SentCertificate.create({ certificate: certificate._id, response: response._id, recipientEmail });
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
// Allow any authenticated user to generate a QR for their form
router.get('/:id/qr', isAuthenticated, async (req, res, next) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      throw new ApiError('Form not found', 404);
    }

  const frontendBase = process.env.FRONTEND_URL || req.headers.origin || 'http://localhost:5173';
  const formUrl = `${frontendBase}/feedback/${form.slug || form._id}`;
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