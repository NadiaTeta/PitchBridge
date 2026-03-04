const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  deleteAccount,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  uploadDocs,
  updatePassword
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const { authRateLimiter } = require('../middleware/rateLimiter.middleware');
const upload = require('../utils/fileUpload');

// Public routes
router.post('/register', authRateLimiter, register);
router.post('/login', authRateLimiter, login);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);
router.post('/forgot-password', authRateLimiter, forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);
router.post('/upload-docs', protect, upload.array('document', 5), uploadDocs);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.delete('/me', protect, deleteAccount);
router.put('/update-password', protect, updatePassword);

module.exports = router;