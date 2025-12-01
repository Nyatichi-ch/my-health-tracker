const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const router = express.Router();

const User = require('../models/User');

const createToken = (user) => {
  const secret = process.env.JWT_SECRET || 'changeme_dev_secret';
  return jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: '7d' });
};

// Register
router.post('/register',
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { email, password, name } = req.body;
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ error: 'Email already in use' });

      const passwordHash = await bcrypt.hash(password, 10);
      const user = new User({ email, passwordHash, name });
      await user.save();

      const token = createToken(user);
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      return res.status(201).json({ id: user._id, email: user.email, name: user.name });
    } catch (err) {
      console.error('Register error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  }
);

// Login
router.post('/login',
  body('email').isEmail(),
  body('password').exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ error: 'Invalid credentials' });

      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) return res.status(400).json({ error: 'Invalid credentials' });

      const token = createToken(user);
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      return res.json({ id: user._id, email: user.email, name: user.name });
    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  }
);

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({ ok: true });
});

// Me
router.get('/me', async (req, res) => {
  try {
    const token = req.cookies && req.cookies.token;
    if (!token) return res.status(200).json({ user: null });

    const secret = process.env.JWT_SECRET || 'changeme_dev_secret';
    const payload = jwt.verify(token, secret);
    const user = await User.findById(payload.id).select('-passwordHash');
    return res.json({ user });
  } catch (err) {
    return res.status(200).json({ user: null });
  }
});

module.exports = router;
