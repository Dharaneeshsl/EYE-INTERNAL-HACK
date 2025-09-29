/**
 * Custom error class for API errors
 * @extends Error
 */
class ApiError extends Error {
  /**
   * Create a new API error
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @param {boolean} isOperational - Whether the error is operational
   * @param {string} stack - Error stack trace
   */
  constructor(message, statusCode = 500, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Error factory function to create common HTTP errors
 * @param {number} statusCode - HTTP status code
 * @param {string} defaultMessage - Default error message
 * @returns {class} Error class
 */
const createErrorClass = (statusCode, defaultMessage) => {
  return class extends ApiError {
    constructor(message = defaultMessage) {
      super(message, statusCode);
    }
  };
};

// Common HTTP error classes
const BadRequestError = createErrorClass(400, 'Bad Request');
const UnauthenticatedError = createErrorClass(401, 'Not authenticated');
const UnauthorizedError = createErrorClass(403, 'Not authorized');
const NotFoundError = createErrorClass(404, 'Resource not found');
const ConflictError = createErrorClass(409, 'Resource already exists');
const RateLimitError = createErrorClass(429, 'Too many requests, please try again later');

/**
 * 422 Validation Error
 * @extends ApiError
 */
class ValidationError extends ApiError {
  /**
   * @param {Object} errors - Validation errors
   * @param {string} message - Error message
   */
  constructor(errors, message = 'Validation failed') {
    super(message, 422);
    this.errors = errors;
  }
}

export {
  ApiError,
  BadRequestError,
  UnauthenticatedError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
  ValidationError,
  RateLimitError
};
