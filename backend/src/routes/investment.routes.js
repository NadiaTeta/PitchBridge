const express = require('express');
const router = express.Router();
const {
  createInvestment,
  getInvestments,
  getInvestment,
  updateInvestmentStatus,
  agreeToTerms
} = require('../controllers/investment.controller');
const { protect, authorize, requireEmailVerification, requireApproval } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(protect);
router.use(requireEmailVerification);
router.use(requireApproval);

// Investor routes
router.post('/', authorize('investor'), createInvestment);
router.get('/my-investments', authorize('investor'), getInvestments);
router.get('/:id', getInvestment);
router.put('/:id/agree-terms', authorize('investor'), agreeToTerms);

// Entrepreneur routes - view investments in their projects
router.get('/project/:projectId', authorize('entrepreneur'), getInvestments);

// Admin routes
router.put('/:id/status', authorize('admin'), updateInvestmentStatus);

module.exports = router;