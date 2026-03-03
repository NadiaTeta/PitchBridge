const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true,
    maxlength: 2000
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const chatSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  investor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  entrepreneur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messages: [messageSchema],
  
  // Chat status
  status: {
    type: String,
    enum: ['active', 'archived', 'blocked'],
    default: 'active'
  },
  
  // Last activity
  lastMessage: {
    text: String,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    date: Date
  },
  
  // Unread counts
  unreadCount: {
    investor: { type: Number, default: 0 },
    entrepreneur: { type: Number, default: 0 }
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for queries
chatSchema.index({ investor: 1, entrepreneur: 1 });
chatSchema.index({ project: 1 });
chatSchema.index({ 'lastMessage.date': -1 });

// Update last message when new message is added
chatSchema.methods.addMessage = async function(senderId, text) {
  const message = {
    sender: senderId,
    text,
    createdAt: new Date()
  };
  
  this.messages.push(message);
  this.lastMessage = {
    text,
    sender: senderId,
    date: new Date()
  };
  
  // Update unread count
  if (senderId.toString() === this.investor.toString()) {
    this.unreadCount.entrepreneur += 1;
  } else {
    this.unreadCount.investor += 1;
  }
  
  return await this.save();
};

// Mark messages as read
chatSchema.methods.markAsRead = async function(userId) {
  this.messages.forEach(message => {
    if (message.sender.toString() !== userId.toString() && !message.read) {
      message.read = true;
      message.readAt = new Date();
    }
  });
  
  // Reset unread count
  if (userId.toString() === this.investor.toString()) {
    this.unreadCount.investor = 0;
  } else {
    this.unreadCount.entrepreneur = 0;
  }
  
  return await this.save();
};

module.exports = mongoose.model('Chat', chatSchema);