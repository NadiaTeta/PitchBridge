const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 1. Define where to store the images temporarily
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // This goes up from src/middleware to backend/uploads
    const uploadPath = path.join(__dirname, '../../uploads');
    
    // Safety check: Create folder if it somehow disappeared
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Create a professional unique name
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// 2. Filter to only allow images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

// 3. Initialize Multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB Limit
  },
  fileFilter: fileFilter
});

module.exports = upload;