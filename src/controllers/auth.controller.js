const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, gender, dateOfBirth } = req.body;

    // Required fields
    if (!name || !name.trim()) return res.status(400).json({ message: 'Name is required' });
    if (!email || !email.trim()) return res.status(400).json({ message: 'Email is required' });
    if (!password) return res.status(400).json({ message: 'Password is required' });

    // Format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ message: 'Invalid email format' });

    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
    if (name.trim().length > 50) return res.status(400).json({ message: 'Name must be 50 characters or less' });

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const user = await User.create({ name: name.trim(), email, password, phone, gender, dateOfBirth });
    const token = signToken(user._id);

    res.status(201).json({ token, user });
  } catch (err) {
    // Return 400 for Mongoose validation errors, not 500
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map((e) => e.message).join(', ');
      return res.status(400).json({ message });
    }
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });

    if (user.status === 'suspended')
      return res.status(403).json({ message: 'Account suspended. Contact admin.' });

    const token = signToken(user._id);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  res.json({ user: req.user });
};
