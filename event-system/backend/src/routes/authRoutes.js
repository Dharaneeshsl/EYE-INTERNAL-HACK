import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { UnauthenticatedError, ApiError } from '../utils/errors.js';

const router = express.Router();

// Register route
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      throw new ApiError('Name, email and password are required', 400);
    }
    const exists = await User.findOne({ email });
    if (exists) {
      throw new ApiError('Email already in use', 400);
    }
    const user = await User.create({ name, email, password });

    // Set session
    req.session.user = { id: user._id, email: user.email, role: user.role };

    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
});

// Login route
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
   const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthenticatedError('Invalid credentials');
    }

    // Set user in session
    req.session.user = {
      id: user._id,
      email: user.email,
      role: user.role
    };

    res.json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
});

// Logout route
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Could not log out' });
    }
    res.clearCookie('connect.sid'); // Clear session cookie
    res.json({ message: 'Logged out successfully' });
  });
});


// Get current user route
router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json({ user: req.session.user });
});

// Alias for /me to support /profile route
import { isAuthenticated } from '../middleware/auth.js';
router.get('/profile', isAuthenticated, (req, res) => {
  res.json({ user: req.session.user });
});

export default router;