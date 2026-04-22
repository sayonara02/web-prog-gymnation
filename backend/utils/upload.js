const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Check if Cloudinary is configured
const useCloudinary = process.env.CLOUDINARY_CLOUD_NAME && 
                      process.env.CLOUDINARY_API_KEY && 
                      process.env.CLOUDINARY_API_SECRET;

let cloudinary;

if (useCloudinary) {
  cloudinary = require('cloudinary').v2;
}

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (JPEG, JPG, PNG, GIF, WebP)'));
  }
};

// Common multer options
const commonOptions = {
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
};

// Storage for post images (local)
const postStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/posts');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `post-${uniqueSuffix}${ext}`);
  }
});

// Storage for profile pictures (local)
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/profiles');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `profile-${uniqueSuffix}${ext}`);
  }
});

// Memory storage for Cloudinary
const memoryStorage = multer.memoryStorage();

// Middleware factory - returns appropriate middleware based on config
const createUploadMiddleware = (type) => {
  if (useCloudinary) {
    // Cloudinary: use memory storage, upload after multer
    const upload = multer({
      storage: memoryStorage,
      ...commonOptions
    }).single(type === 'post' ? 'image' : 'profilePic');

    return async (req, res, next) => {
      return upload(req, res, async (err) => {
        if (err) return next(err);
        if (!req.file) return next();

        try {
          // Upload to Cloudinary
          const folder = type === 'post' ? 'pridefitgym/posts' : 'pridefitgym/profiles';
          
          const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              {
                resource_type: 'image',
                folder: folder,
                allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
                transformation: [
                  { width: 1200, height: 1200, crop: 'limit' },
                  { quality: 'auto' }
                ]
              },
              (error, result) => {
                if (error) return reject(error);
                resolve(result);
              }
            ).end(req.file.buffer);
          });

          // Replace file with Cloudinary URL
          req.body.image = uploadResult.secure_url;
          req.file = null; // Prevent further processing
          next();
        } catch (uploadErr) {
          next(uploadErr);
        }
      });
    };
  } else {
    // Local storage: use diskStorage
    const storage = type === 'post' ? postStorage : profileStorage;
    return multer({
      storage,
      ...commonOptions
    }).single(type === 'post' ? 'image' : 'profilePic');
  }
};

// Create middleware instances
const middlewareUploadPost = createUploadMiddleware('post');
const middlewareUploadProfile = createUploadMiddleware('profile');

// Legacy exports for backwards compatibility with existing route code
const uploadPostLocal = multer({
  storage: postStorage,
  ...commonOptions
});

const uploadProfileLocal = multer({
  storage: profileStorage,
  ...commonOptions
});

const uploadPostMemory = multer({
  storage: memoryStorage,
  ...commonOptions
}).single('image');

const uploadProfileMemory = multer({
  storage: memoryStorage,
  ...commonOptions
}).single('profilePic');

// Helper function to get file URL
const getFileUrl = (filePath, type) => {
  if (useCloudinary && filePath && filePath.startsWith('http')) {
    return filePath; // Already a full Cloudinary URL
  }
  if (!filePath) return '';
  
  // Local file - return full URL
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const host = process.env.BASE_URL || (process.env.NODE_ENV === 'production' ? 'your-backend.onrender.com' : 'localhost:5000');
  return `${protocol}://${host}${filePath}`;
};

// Delete file helper
const deleteFile = async (filePath) => {
  if (!filePath) return;
  
  if (useCloudinary) {
    // Extract public ID from Cloudinary URL
    try {
      const parts = filePath.split('/');
      const publicId = parts.slice(-2).join('/').split('.')[0]; // folder/filename without extension
      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      console.error('Error deleting from Cloudinary:', err);
    }
  } else if (!filePath.startsWith('http')) {
    // Local file
    const fullPath = path.join(__dirname, '..', filePath);
    try {
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    } catch (err) {
      console.error('Error deleting local file:', err);
    }
  }
};

module.exports = {
  // New middleware that handles Cloudinary automatically
  uploadPost: middlewareUploadPost,
  uploadProfile: middlewareUploadProfile,
  
  // Legacy local storage middleware (if needed)
  uploadPostLocal,
  uploadProfileLocal,
  
  // Memory storage middleware (for manual Cloudinary handling)
  uploadPostMemory,
  uploadProfileMemory,
  
  // Helpers
  useCloudinary,
  getFileUrl,
  deleteFile,
};
