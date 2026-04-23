const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Contact = require('../models/Contact');
const { protect, admin } = require('../middleware/auth.middleware');

// @GET    /api/admin/users
// Get all users (admin only)
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find().lean().select('-password');
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
});

// @PUT    /api/admin/users/:id/role
// Update user role (admin only)
router.put('/users/:id/role', protect, admin, async (req, res) => {
  try {
    const { role } = req.body;

    if (!['member', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { role } },
      { new: true, lean: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'User role updated successfully',
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
});

// @PUT    /api/admin/users/:id/status
// Update user status (admin only)
router.put('/users/:id/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true, lean: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'User status updated successfully',
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
});

// @DELETE /api/admin/users/:id
// Delete user (admin only)
router.delete('/users/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent deleting self
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account',
      });
    }

    // Delete user's posts and comments
    await Post.deleteMany({ user: user._id });
    await Comment.deleteMany({ user: user._id });

    await user.deleteOne();

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
});

// @GET    /api/admin/posts
// Get all posts with user info (admin only) - pagination supported
router.get('/posts', protect, admin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate('user', 'name email profilePic')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Post.countDocuments();

    res.json({ 
      success: true, 
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
});

// @DELETE /api/admin/posts/:id
// Delete post (admin only)
router.delete('/posts/:id', protect, admin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    await post.deleteOne();

    res.json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
});

// @GET    /api/admin/contacts
// Get all contact messages (admin only)
router.get('/contacts', protect, admin, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, contacts });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
});

// @PUT    /api/admin/contacts/:id/status
// Update contact message status (admin only)
router.put('/contacts/:id/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['new', 'read', 'replied', 'archived'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const updateData = { status };
    if (status === 'replied') {
      updateData.repliedBy = req.user._id;
      updateData.repliedAt = new Date();
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found',
      });
    }

    res.json({
      success: true,
      message: 'Contact status updated successfully',
      contact,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
});

// @DELETE /api/admin/contacts/:id
// Delete contact message (admin only)
router.delete('/contacts/:id', protect, admin, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found',
      });
    }

    await contact.deleteOne();

    res.json({
      success: true,
      message: 'Contact message deleted successfully',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
});

module.exports = router;

