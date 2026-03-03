const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  searchProjects,
  getMyProjects,
  incrementViews
} = require('../controllers/project.controller');
const { 
  protect, 
  authorize, 
  requireEmailVerification, 
  requireDocuments,
  requireApproval 
} = require('../middleware/auth.middleware');

// Public routes
router.get('/', getProjects);
router.get('/search', searchProjects);
router.get('/:id', getProject);
router.post('/:id/view', incrementViews);

// Protected routes - require authentication
router.use(protect);
router.use(requireEmailVerification);

// Entrepreneur routes
router.post(
  '/',
  authorize('entrepreneur'),
  requireDocuments,
  requireApproval,
  createProject
);

router.get(
  '/my/projects',
  authorize('entrepreneur'),
  getMyProjects
);

router.put(
  '/:id',
  authorize('entrepreneur'),
  updateProject
);

router.delete(
  '/:id',
  authorize('entrepreneur'),
  deleteProject
);

module.exports = router;