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
  constructor(
    message,
    statusCode,
    isOperational = true,
    stack = ''
  ) {
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
 * 400 Bad Request Error
 * @extends ApiError
 */
class BadRequestError extends ApiError {
  constructor(message = 'Bad Request') {
    super(message, 400);
  }
}

/**
 * 401 Unauthorized Error
 * @extends ApiError
 */
class UnauthenticatedError extends ApiError {
  constructor(message = 'Not authenticated') {
    super(message, 401);
  }
}

/**
 * 403 Forbidden Error
 * @extends ApiError
 */
class UnauthorizedError extends ApiError {
  constructor(message = 'Not authorized') {
    super(message, 403);
  }
}

/**
 * 404 Not Found Error
 * @extends ApiError
 */
class NotFoundError extends ApiError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

/**
 * 409 Conflict Error
 * @extends ApiError
 */
class ConflictError extends ApiError {
  constructor(message = 'Resource already exists') {
    super(message, 409);
  }
}

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

/**
 * 429 Too Many Requests Error
 * @extends ApiError
 */
class RateLimitError extends ApiError {
  constructor(message = 'Too many requests, please try again later') {
    super(message, 429);
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
