import { UnauthenticatedError, UnauthorizedError } from '../utils/errors.js';

// Session-based authentication middleware
export const isAuthenticated = async (req, res, next) => {
  try {
    if (!req.session.user) {
      throw new UnauthenticatedError('Authentication required');
    }
    req.user = req.session.user;
    next();
  } catch (error) {
    next(error);
  }
};

// Simple admin check
export const isAdmin = (req, res, next) => 
  req.user?.role === 'admin' ? next() : res.status(403).json({ error: 'Not admin' });

/**
 * Middleware to check if user is the owner of a resource
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const isOwner = (req, res, next) => {
  try {
    if (!req.user || req.user.id !== req.params.userId) {
      throw new UnauthorizedError('Not authorized to access this resource');
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to check if user has a specific role
 * @param {...String} roles - Roles allowed to access the route
 * @returns {Function} - Express middleware function
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user || !roles.includes(req.user.role)) {
        throw new UnauthorizedError('Not authorized to access this route');
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};
