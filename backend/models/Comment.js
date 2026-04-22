const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  post: {
    type: mongoose.Schema.ObjectId,
    ref: 'Post',
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
}, {
  timestamps: true,
});

// Ensure one user can only comment once per post (optional)
commentSchema.index({ user: 1, post: 1 }, { unique: true });

module.exports = mongoose.model('Comment', commentSchema);
