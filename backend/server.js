const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

console.log('1. Starting server...');

// Load environment variables
dotenv.config();
console.log('2. Environment variables loaded');

// Ensure upload directories exist
const uploadsDirs = ['uploads/posts', 'uploads/profiles'];
uploadsDirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✅ Created directory: ${fullPath}`);
  }
});
console.log('3. Upload directories ready');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
const commentRoutes = require('./routes/comment.routes');
const adminRoutes = require('./routes/admin.routes');
console.log('4. Routes imported successfully');

const app = express();
console.log('5. Express app created');

// CORS Middleware - ADD THIS (Place BEFORE other middleware)
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true, // Allow cookies/tokens
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
console.log('5.5 CORS configured');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
console.log('6. Middleware configured');

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log('7. Static files configured');

// Database connection
console.log('8. Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pridefitgym', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin', adminRoutes);
console.log('9. Routes configured');

// Basic test route
app.get('/', (req, res) => {
    res.json({ message: 'PrideFitGym API is running' });
});
console.log('10. Test route configured');

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});
console.log('11. Error handler configured');

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
console.log('12. Server listening...');