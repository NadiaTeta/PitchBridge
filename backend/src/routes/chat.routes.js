const express = require('express');
const router = express.Router();
const {
  getChats,
  getChat,
  createChat,
  sendMessage,
  markAsRead
} = require('../controllers/chat.controller');
const { protect, requireEmailVerification, requireApproval } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(protect);
router.use(requireEmailVerification);
router.use(requireApproval);

router.get('/', getChats);
router.get('/:id', getChat);
router.post('/', createChat);
router.post('/:id/message', sendMessage);
router.put('/:id/read', markAsRead);

module.exports = router;