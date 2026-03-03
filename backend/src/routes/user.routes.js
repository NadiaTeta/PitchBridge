const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  uploadProfilePicture,
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist,
  getPortfolio,
  addProjectToPortfolio
} = require('../controllers/user.controller');
const { protect, requireEmailVerification } = require('../middleware/auth.middleware');
const upload = require('../middleware/multer.middleware');

// All routes require authentication
router.use(protect);

// Profile routes
router.get('/profile/:id?', getProfile);
router.put('/profile', updateProfile);
//router.post('/profile-picture', uploadProfilePicture);
router.post('/profile-picture', protect, upload.single('profilePicture'), uploadProfilePicture);

// Watchlist routes (investors)
router.post('/watchlist/:projectId', requireEmailVerification, addToWatchlist);
router.delete('/watchlist/:projectId', removeFromWatchlist);
router.get('/watchlist', getWatchlist);

// Portfolio routes
router.get('/portfolio', getPortfolio);
router.post('/portfolio/add', protect, addProjectToPortfolio);

module.exports = router;