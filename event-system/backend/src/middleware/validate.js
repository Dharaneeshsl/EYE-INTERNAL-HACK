import { validationResult } from 'express-validator';
import { ValidationError } from '../utils/errors.js';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const mapped = errors.array().map(e => ({ field: e.path, message: e.msg }));
    return next(new ValidationError(mapped));
  }
  next();
};

export default validate;


