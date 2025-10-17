import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { UnauthenticatedError, ApiError } from '../utils/errors.js';

const router = express.Router();
// Get current profile
router.get('/profile', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }
  res.json({ user: req.session.user });
});

// Register route
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      throw new ApiError('Name, email and password are required', 400);
    }
   const exists = await User.findOne({ email }).select('+password');
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
    const cookieName = process.env.SESSION_NAME || 'sid';
    res.clearCookie(cookieName);
    res.json({ message: 'Logged out successfully' });
  });
});


// Update profile basic fields
router.put('/profile', async (req, res, next) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    const { name, password } = req.body || {};
    const user = await User.findById(req.session.user.id).select('+password');
    if (!user) throw new ApiError('User not found', 404);

    if (typeof name === 'string' && name.trim()) user.name = name.trim();
    if (typeof password === 'string' && password.length >= 8) {
      user.password = password; // pre-save hook will hash
    }
    await user.save();

    // refresh session snapshot
    req.session.user = { id: user._id, email: user.email, role: user.role };
    res.json({ user: req.session.user });
  } catch (error) {
    next(error);
  }
});

export default router;