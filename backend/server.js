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

// Environment configuration
const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL || (isProduction ? `http://localhost:${PORT}` : 'http://localhost:5000');

// Make BASE_URL available globally
global.BASE_URL = BASE_URL;

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
const contactRoutes = require('./routes/contact.routes');
console.log('4. Routes imported successfully');

const app = express();
console.log('5. Express app created');

// CORS Middleware - Configure allowed origins
const corsOrigin = process.env.CORS_ORIGIN || (isProduction ? BASE_URL : 'http://localhost:3000');
app.use(cors({
  origin: corsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
console.log('5.5 CORS configured');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
console.log('6. Middleware configured');

// Serve static files (only needed if using local storage)
if (!process.env.CLOUDINARY_CLOUD_NAME) {
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
  console.log('7. Static files configured');
} else {
  console.log('7. Using Cloudinary for file storage - skipping local static serving');
}

// Database connection
console.log('8. Connecting to MongoDB...');
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pridefitgym';
mongoose.connect(mongoURI, {
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
app.use('/api/contacts', contactRoutes);
console.log('9. Routes configured');

// Basic test route
app.get('/', (req, res) => {
    res.json({ 
      message: 'PrideFitGym API is running',
      environment: isProduction ? 'production' : 'development',
      timestamp: new Date().toISOString()
    });
});
console.log('10. Test route configured');

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
      message: 'Something went wrong!', 
      error: err.message,
      timestamp: new Date().toISOString()
    });
});
console.log('11. Error handler configured');

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 Environment: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
    console.log(`🔗 Base URL: ${BASE_URL}`);
    console.log(`🌐 CORS Origin: ${corsOrigin}`);
});
console.log('12. Server listening...');