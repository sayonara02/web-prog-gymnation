const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');
const { protect } = require('../middleware/auth.middleware');
const { uploadPost, deleteFile } = require('../utils/upload');
const path = require('path');

// @GET    /api/posts
// Get all posts with comments and user info
router.get('/', async (req, res) => {
  try {
    // Fetch all posts with user info
    const posts = await Post.find()
      .populate('user', 'name profilePic')
      .sort({ createdAt: -1 });

    // Get all post IDs
    const postIds = posts.map(post => post._id);

    // Fetch all comments for these posts in one query
    const comments = await Comment.find({ post: { $in: postIds } })
      .populate('user', 'name profilePic')
      .sort({ createdAt: -1 });

    // Group comments by post ID
    const commentsByPost = comments.reduce((acc, comment) => {
      const postId = comment.post._id.toString();
      if (!acc[postId]) {
        acc[postId] = [];
      }
      acc[postId].push(comment);
      return acc;
    }, {});

    // Attach comments to posts
    const postsWithComments = posts.map(post => ({
      ...post.toObject(),
      comments: commentsByPost[post._id.toString()] || [],
    }));

    res.json({ success: true, posts: postsWithComments });
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
});

// @GET    /api/posts/:id
// Get single post with comments
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'name profilePic');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Fetch comments for this post
    const comments = await Comment.find({ post: post._id })
      .populate('user', 'name profilePic')
      .sort({ createdAt: -1 });

    // Attach comments to post
    const postWithComments = {
      ...post.toObject(),
      comments,
    };

    res.json({ success: true, post: postWithComments });
  } catch (err) {
    console.error('Error fetching post:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
});

// @POST   /api/posts
// Create a new post with optional image upload
router.post('/', protect, uploadPost, async (req, res) => {
  try {
    const { description } = req.body;

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Description is required',
      });
    }

    // Handle image - either uploaded file (local or Cloudinary) or URL from body
    let image = '';
    if (req.body.image) {
      // Cloudinary URL (from middleware) or direct URL
      image = req.body.image;
    } else if (req.file) {
      // Local file - construct path
      image = `/uploads/posts/${req.file.filename}`;
    }

    const post = await Post.create({
      user: req.user._id,
      description: description.trim(),
      image: image,
    });

    // Populate user info for response
    const populatedPost = await Post.findById(post._id)
      .populate('user', 'name profilePic');

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post: populatedPost,
    });
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

// @DELETE /api/posts/:id
// Delete a post (only owner or admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check if user owns the post or is admin
    if (post.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post',
      });
    }

    // Delete associated comments
    await Comment.deleteMany({ post: post._id });

    // Delete uploaded image if exists using helper
    if (post.image) {
      await deleteFile(post.image);
    }

    // Delete post
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

module.exports = router;
