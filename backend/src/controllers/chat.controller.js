const Chat = require('../models/Chat.model');
const Project = require('../models/Project.model');
  exports.getChats = async (req, res, next) => {
    try {
      const userId = req.user._id;
      const role = req.user.role;

      // Investors: only chats they requested (where they are the investor)
      // Entrepreneurs: only chats about their projects (where they are the entrepreneur)
      if (role !== 'investor' && role !== 'entrepreneur') {
        return res.status(200).json({ success: true, count: 0, chats: [] });
      }

      const query = role === 'investor'
        ? { investor: userId }
        : { entrepreneur: userId };

      const chats = await Chat.find(query)
        .populate('project', 'name image')
        .populate('investor', 'name')
        .populate('entrepreneur', 'name')
        .sort({ 'lastMessage.date': -1, updatedAt: -1 });

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

      const userId = req.user._id.toString();
      const investorId = (chat.investor && (chat.investor._id || chat.investor)).toString();
      const entrepreneurId = (chat.entrepreneur && (chat.entrepreneur._id || chat.entrepreneur)).toString();
      const isParticipant = investorId === userId || entrepreneurId === userId;
      if (!isParticipant) {
        return res.status(403).json({
          success: false,
          message: 'You can only view chats you are part of'
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

  // @desc    Create new chat (only investors can request to connect)
  // @route   POST /api/v1/chat
  // @access  Private
  exports.createChat = async (req, res, next) => {
    try {
      if (req.user.role !== 'investor') {
        return res.status(403).json({
          success: false,
          message: 'Only investors can request to connect with a project'
        });
      }

      const { projectId } = req.body;

      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      const userId = req.user._id;

      // Check if chat already exists (this investor already requested this project)
      const existingChat = await Chat.findOne({
        project: projectId,
        investor: userId
      });

      if (existingChat) {
        return res.status(200).json({
          success: true,
          chat: existingChat
        });
      }

      const chat = await Chat.create({
        project: projectId,
        investor: userId,
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

      const userId = req.user._id.toString();
      const isParticipant =
        chat.investor.toString() === userId ||
        chat.entrepreneur.toString() === userId;
      if (!isParticipant) {
        return res.status(403).json({
          success: false,
          message: 'You can only send messages in your own conversations'
        });
      }

      await chat.addMessage(req.user._id, text);

      // Emit socket event
      const io = req.app.get('io');
      io.to(req.params.id).emit('new-message', {
        chatId: req.params.id,
        message: {
          sender: req.user._id,
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

      const userId = req.user._id.toString();
      const isParticipant =
        chat.investor.toString() === userId ||
        chat.entrepreneur.toString() === userId;
      if (!isParticipant) {
        return res.status(403).json({
          success: false,
          message: 'You can only mark your own conversations as read'
        });
      }

      await chat.markAsRead(req.user._id);

      res.status(200).json({
        success: true,
        chat
      });
    } catch (error) {
      next(error);
    }
  }
;