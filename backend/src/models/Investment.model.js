const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  investor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Please provide an investment amount'],
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed', 'refunded'],
    default: 'pending'
  },
  
  // Terms agreement
  termsAgreed: {
    type: Boolean,
    default: false
  },
  termsAgreedDate: Date,
  
  // Payment information
  paymentMethod: {
    type: String,
    enum: ['bank_transfer', 'mobile_money', 'card', 'other']
  },
  paymentReference: String,
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  
  // Returns tracking
  expectedReturn: Number,
  actualReturn: {
    type: Number,
    default: 0
  },
  returnDate: Date,
  
  // Communication
  notes: [{
    text: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  
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
investmentSchema.index({ investor: 1, status: 1 });
investmentSchema.index({ project: 1, status: 1 });
investmentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Investment', investmentSchema);