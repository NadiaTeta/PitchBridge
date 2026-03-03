const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { trim } = require('lodash');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['entrepreneur', 'investor', 'admin'],
    required: true
  },
  phone: {
    type: String,
    match: [/^\+250\s?\d{3}\s?\d{3}\s?\d{3}$/, 'Please provide a valid Rwandan phone number']
  },
  bio: {
    type: String,
    maxlength: 500
  },
  location: {
    type: String
  },
  profilePicture: {
    type: String,
    default: null
  },
  
  // Verification status
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpire: Date,
  
  documentsUploaded: {
    type: Boolean,
    default: false
  },
  accountApproved: {
    type: Boolean,
    default: false
  },
  verificationLevel: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'none'],
    default: 'none'
  },
  
  // Document verification
  verified: {
    nid: { type: Boolean, default: false },
    tin: { type: Boolean, default: false },
    rdb: { type: Boolean, default: false }
  },
  
  documents: [{
    type: {
      type: String,
      enum: ['nid', 'tin', 'rdb', 'passport', 'selfie']
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    uploadDate: Date,
    azureUrl: String,
    fileName: String,
    rejectionReason: String
  }],
  
  // Account status
  accountStatus: {
    type: String,
    enum: ['active', 'suspended', 'deactivated'],
    default: 'active'
  },
  
  // For entrepreneurs
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  totalFundingRaised: {
    type: Number,
    default: 0
  },
  
  // For investors
  watchlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  portfolio: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Investment'
  }],
  investmentHistory: [{
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project'
    },
    amount: Number,
    date: Date
  }],
  preferredSectors: [String],
  totalInvested: {
    type: Number,
    default: 0
  },
  
  // Password reset
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  
  // Timestamps
  lastLogin: Date,
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

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate email verification token
userSchema.methods.getEmailVerificationToken = function() {
  const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
  
  this.emailVerificationToken = verificationToken;
  this.emailVerificationExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
  
  return verificationToken;
};

// Update verification level based on verified documents
userSchema.methods.updateVerificationLevel = function() {
  const { nid, tin, rdb } = this.verified;
  
  if (nid && tin && rdb) {
    this.verificationLevel = 'gold';
  } else if (nid && tin) {
    this.verificationLevel = 'silver';
  } else if (nid) {
    this.verificationLevel = 'bronze';
  } else {
    this.verificationLevel = 'none';
  }
};

module.exports = mongoose.model('User', userSchema);