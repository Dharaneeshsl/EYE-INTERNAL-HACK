import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { UnauthenticatedError } from '../utils/errors.js';

const router = express.Router();

// Login route
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
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

export default router;