const express = require('express');
const router = express.Router();
const {
  getPendingVerifications,
  getVerificationDetails,
  approveProject,
  rejectProject,
  requestClarification,
  getPendingUsers,
  getAllUsers,
  getUserDetails,
  approveUser,
  rejectUser,
  approveDocument,
  rejectDocument,
  suspendUser,
  activateUser,
  getStats,
} = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// All routes require admin authentication
router.use(protect);
router.use(authorize('admin'));

// Project Verification Routes
router.get('/verifications/pending', getPendingVerifications);
router.get('/verifications/:id', getVerificationDetails);
router.put('/verifications/:id/approve', approveProject);
router.put('/verifications/:id/reject', rejectProject);
router.put('/verifications/:id/clarification', requestClarification);

// User ID Verification Routes
router.get('/users/pending', getPendingUsers);  // Users needing ID verification
router.get('/users/:id', getUserDetails);        // Get single user with documents
router.get('/users', getAllUsers);               // Get all users
router.put('/users/:id/approve', approveUser);   // Approve entire user
router.put('/users/:id/reject', rejectUser);     // Reject entire user
router.put('/users/:id/suspend', suspendUser);   // Suspend user account
router.put('/users/:id/activate', activateUser); // Activate user account

// Individual Document Verification Routes
router.put('/documents/:userId/:documentId/approve', approveDocument);
router.put('/documents/:userId/:documentId/reject', rejectDocument);

// Statistics
router.get('/stats', getStats);

module.exports = router;