const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a project name'],
    trim: true,
    maxlength: 100
  },
  entrepreneur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a project description'],
    maxlength: 2000
  },
  category: {
    type: String,
    required: true,
    enum: ['Agriculture', 'Tech', 'Retail', 'Manufacturing', 'Services', 'Healthcare', 'Education', 'Other']
  },
  location: {
    type: String,
    required: [true, 'Please provide a location']
  },
  
  // Funding details
  fundingGoal: {
    type: Number,
    required: [true, 'Please provide a funding goal'],
    min: 0
  },
  raised: {
    type: Number,
    default: 0,
    min: 0
  },
  roi: {
    type: String,
    required: [true, 'Please provide ROI information'],
    maxlength: 500
  },
  
  // Media
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800'
  },
  video: {
    type: String,
    default: null
  },
  
  // Status
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'clarification_needed'],
    default: 'pending'
  },
  
  // Verification
  verified: {
    nid: { type: Boolean, default: false },
    rdb: { type: Boolean, default: false }
  },
  
  // Investment tracking
  investors: [{
    investor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    amount: Number,
    date: Date,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'rejected'],
      default: 'pending'
    }
  }],
  
  // Engagement metrics
  views: {
    type: Number,
    default: 0
  },
  watchlistCount: {
    type: Number,
    default: 0
  },
  
  // Timeline
  startDate: Date,
  endDate: Date,
  
  // Admin notes
  adminNotes: [{
    note: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  rejectionReason: String,
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for funding progress percentage
projectSchema.virtual('fundingProgress').get(function() {
  return Math.round((this.raised / this.fundingGoal) * 100);
});

// Index for search optimization
projectSchema.index({ name: 'text', description: 'text', location: 'text' });
projectSchema.index({ category: 1, status: 1 });
projectSchema.index({ entrepreneur: 1 });

// Increment view count
projectSchema.methods.incrementViews = async function() {
  this.views += 1;
  return await this.save();
};

module.exports = mongoose.model('Project', projectSchema);