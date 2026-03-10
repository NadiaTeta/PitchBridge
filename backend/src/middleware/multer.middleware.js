const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// 1. Configure Cloudinary with your .env variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Set up the Cloudinary Storage engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'pitchbridge_uploads', 
    resource_type: 'auto', // Automatically detect file type (image/video)
    allowed_formats: ['jpg', 'png', 'jpeg', 'pdf', 'mp4', 'mov', 'docx'], // Allowed file types
    // This makes the filename unique automatically
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      return 'pb-' + uniqueSuffix;
    }
  }
});

// 3. Filter to only allow images (and PDFs if needed for NIDs)
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 
    'video/', 
    'application/pdf', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  const isAllowed = allowedTypes.some(type => file.mimetype.startsWith(type)); 
  
  if (isAllowed) {
    cb(null, true);
  } else {
    cb(new Error('File type not supported! Please upload an image, video, or document.'), false);
  }
};

// 4. Initialize Multer with Cloudinary Storage
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB Limit
  },
  fileFilter: fileFilter
});

module.exports = upload;