const Chat = require('../models/Chat.model');
const Project = require('../models/Project.model');
  exports.getChats = async (req, res, next) => {
    try {
      const query = req.user.role === 'investor'
        ? { investor: req.user.id }
        : { entrepreneur: req.user.id };

      const chats = await Chat.find(query)
        .populate('project', 'name image')
        .populate('investor', 'name')
        .populate('entrepreneur', 'name')
        .sort({ 'lastMessage.date': -1 });

      res.status(200).json({
        success: true,
        count: chats.length,
        chats
      });
    } catch (error) {
      next(error);
    }
  },


  exports.getChat = async (req, res, next) => {
    try {
      const chat = await Chat.findById(req.params.id)
        .populate('project')
        .populate('investor', 'name email')
        .populate('entrepreneur', 'name email');

      if (!chat) {
        return res.status(404).json({
          success: false,
          message: 'Chat not found'
        });
      }

      res.status(200).json({
        success: true,
        chat
      });
    } catch (error) {
      next(error);
    }
  },

  // @desc    Create new chat
  // @route   POST /api/v1/chat
  // @access  Private
  exports.createChat = async (req, res, next) => {
    try {
      const { projectId } = req.body;

      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      // Check if chat already exists
      const existingChat = await Chat.findOne({
        project: projectId,
        investor: req.user.id
      });

      if (existingChat) {
        return res.status(200).json({
          success: true,
          chat: existingChat
        });
      }

      const chat = await Chat.create({
        project: projectId,
        investor: req.user.id,
        entrepreneur: project.entrepreneur
      });

      res.status(201).json({
        success: true,
        chat
      });
    } catch (error) {
      next(error);
    }
  },

  // @desc    Send message
  // @route   POST /api/v1/chat/:id/message
  // @access  Private
  exports.sendMessage = async (req, res, next) => {
    try {
      const { text } = req.body;
      const chat = await Chat.findById(req.params.id);

      if (!chat) {
        return res.status(404).json({
          success: false,
          message: 'Chat not found'
        });
      }

      await chat.addMessage(req.user.id, text);

      // Emit socket event
      const io = req.app.get('io');
      io.to(req.params.id).emit('new-message', {
        chatId: req.params.id,
        message: {
          sender: req.user.id,
          text,
          timestamp: new Date()
        }
      });

      res.status(200).json({
        success: true,
        chat
      });
    } catch (error) {
      next(error);
    }
  },

  // @desc    Mark messages as read
  // @route   PUT /api/v1/chat/:id/read
  // @access  Private
  exports.markAsRead = async (req, res, next) => {
    try {
      const chat = await Chat.findById(req.params.id);

      if (!chat) {
        return res.status(404).json({
          success: false,
          message: 'Chat not found'
        });
      }

      await chat.markAsRead(req.user.id);

      res.status(200).json({
        success: true,
        chat
      });
    } catch (error) {
      next(error);
    }
  }
;