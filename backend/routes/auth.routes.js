const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateToken } = require('../utils/token');
const bcrypt = require('bcryptjs');

// @POST   /api/auth/register
// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role: 'member',
      status: 'active',
    });

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
        bio: user.bio,
      },
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(err.errors).map(e => e.message),
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
});

// @POST   /api/auth/login
// Login user and get token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if user is active
    if (user.status === 'inactive') {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive',
      });
    }

    // Verify password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
        bio: user.bio,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
});

// @POST   /api/auth/create-admin
// TEMPORARY: Create default admin user (remove after first use)
router.post('/create-admin', async (req, res) => {
  try {
    const User = require('../models/User');
    const bcrypt = require('bcryptjs');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@pridefitgym.com' });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin user already exists',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash('Admin@2024', salt);

    // Create admin user
    const admin = new User({
      name: 'Admin',
      email: 'admin@pridefitgym.com',
      password: hashedPassword,
      role: 'admin',
      status: 'active',
      bio: 'System Administrator - PrideFitGym',
      profilePic: '',
    });

    await admin.save();

    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      credentials: {
        email: 'admin@pridefitgym.com',
        password: 'Admin@2024',
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to create admin',
      error: err.message,
    });
  }
});

module.exports = router;

