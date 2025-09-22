import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { ApiError } from '../utils/errors.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure storage
const storage = multer.memoryStorage();

// File filter for PDF files only
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new ApiError('Only PDF files are allowed', 400), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1 // Only one file at a time
  }
});

/**
 * Middleware for handling certificate template uploads
 * @param {string} fieldName - Name of the form field containing the file
 * @returns {Function} Multer middleware function
 */
export const uploadCertificateTemplate = (fieldName = 'template') => {
  return upload.single(fieldName);
};

/**
 * Middleware for handling multiple file uploads
 * @param {string} fieldName - Name of the form field containing the files
 * @param {number} maxCount - Maximum number of files
 * @returns {Function} Multer middleware function
 */
export const uploadMultipleFiles = (fieldName = 'files', maxCount = 5) => {
  return upload.array(fieldName, maxCount);
};

/**
 * Middleware for handling form data with file uploads
 * @param {Array} fields - Array of field configurations
 * @returns {Function} Multer middleware function
 */
export const uploadFields = (fields) => {
  return upload.fields(fields);
};

/**
 * Error handling middleware for multer errors
 */
export const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return next(new ApiError('File too large. Maximum size is 10MB', 400));
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return next(new ApiError('Too many files uploaded', 400));
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return next(new ApiError('Unexpected file field', 400));
    }
  }

  if (error.message === 'Only PDF files are allowed') {
    return next(error);
  }

  next(error);
};

/**
 * Validation middleware for uploaded files
 */
export const validateUploadedFile = (req, res, next) => {
  if (!req.file && !req.files) {
    return next(new ApiError('No file uploaded', 400));
  }

  // Additional validation can be added here
  // For example, checking file content, metadata, etc.

  next();
};

export default upload;
