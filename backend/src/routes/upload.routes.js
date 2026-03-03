const express = require('express');
const router = express.Router();
const {
  uploadDocument,
  uploadVideo,
  uploadImage,
  deleteFile
} = require('../controllers/upload.controller');
const { protect, requireEmailVerification } = require('../middleware/auth.middleware');
const { uploadRateLimiter } = require('../middleware/rateLimiter.middleware');
const upload = require('../utils/fileUpload');

// All routes require authentication
router.use(protect);
router.use(requireEmailVerification);
router.use(uploadRateLimiter);

// Document upload (NID, TIN, RDB, etc.)
router.post('/document', upload.single('file'), uploadDocument);

// Video upload (project pitch)
router.post('/video', upload.single('video'), uploadVideo);

// Image upload (project images, profile pictures)
router.post('/image', upload.single('image'), uploadImage);

// Delete file
router.delete('/:fileId', deleteFile);

module.exports = router;