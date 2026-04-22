const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { protect } = require('../middleware/auth.middleware');

// @GET    /api/comments/post/:postId
// Get all comments for a specific post
router.get('/post/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('user', 'name profilePic')
      .sort({ createdAt: -1 });

    res.json({ success: true, comments });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
});

// @POST   /api/comments
// Add a comment to a post (requires authentication)
router.post('/', protect, async (req, res) => {
  try {
    const { postId, content } = req.body;

    if (!postId || !content) {
      return res.status(400).json({
        success: false,
        message: 'Post ID and content are required',
      });
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check if user already commented on this post (optional: prevent duplicates)
    const existingComment = await Comment.findOne({
      user: req.user._id,
      post: postId,
    });

    if (existingComment) {
      return res.status(400).json({
        success: false,
        message: 'You have already commented on this post',
      });
    }

    // Create comment
    const comment = await Comment.create({
      user: req.user._id,
      post: postId,
      content,
    });

    // Populate user info for response
    const populatedComment = await Comment.findById(comment._id)
      .populate('user', 'name profilePic');

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment: populatedComment,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already commented on this post',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
});

// @PUT    /api/comments/:id
// Update a comment (only owner)
router.put('/:id', protect, async (req, res) => {
  try {
    const { content } = req.body;

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    // Check if user owns the comment
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this comment',
      });
    }

    comment.content = content || comment.content;
    await comment.save();

    const updatedComment = await Comment.findById(comment._id)
      .populate('user', 'name profilePic');

    res.json({
      success: true,
      message: 'Comment updated successfully',
      comment: updatedComment,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
});

// @DELETE /api/comments/:id
// Delete a comment (only owner or admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    // Check if user owns the comment or is admin
    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment',
      });
    }

    await comment.deleteOne();

    res.json({
      success: true,
      message: 'Comment deleted successfully',
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
