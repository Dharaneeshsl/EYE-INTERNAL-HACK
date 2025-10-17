import logger from '../utils/logger.js';

export const errorSanitizer = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const isProd = process.env.NODE_ENV === 'production';

  // Log structured error
  logger.error('Request error', {
    method: req.method,
    url: req.originalUrl,
    statusCode,
    message: err.message,
    name: err.name,
    stack: isProd ? undefined : err.stack
  });

  const payload = {
    success: false,
    message: err.message || 'Internal Server Error'
  };

  if (err.errors && Array.isArray(err.errors)) {
    payload.errors = err.errors;
  }

  if (!isProd && err.stack) {
    payload.stack = err.stack;
  }

  res.status(statusCode).json(payload);
};

export default errorSanitizer;


