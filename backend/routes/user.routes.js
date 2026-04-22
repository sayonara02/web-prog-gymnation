const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth.middleware');
const { uploadProfile, deleteFile } = require('../utils/upload');

// @GET    /api/users/profile
// Get current user's profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
});

// @PUT    /api/users/profile
// Update current user's profile (supports both text fields and profile picture upload)
router.put('/profile', protect, uploadProfile, async (req, res) => {
  try {
    const { name, bio } = req.body;

    const updateFields = {};
    if (name) updateFields.name = name;
    if (bio !== undefined) updateFields.bio = bio;

    // Handle profile picture upload - Cloudinary URL is already in req.body.profilePic or local path
    if (req.body.profilePic !== undefined) {
      // Get current user to find old profile picture
      const currentUser = await User.findById(req.user._id);
      const oldProfilePic = currentUser?.profilePic;
      
      // If user is replacing profile pic and there's an old one, delete it
      if (oldProfilePic && oldProfilePic !== req.body.profilePic) {
        await deleteFile(oldProfilePic);
      }
      
      updateFields.profilePic = req.body.profilePic;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ success: true, user });
  } catch (err) {
    // Handle multer errors
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum 5MB allowed',
      });
    }
    if (err.message.includes('Only image files')) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
});

module.exports = router;
