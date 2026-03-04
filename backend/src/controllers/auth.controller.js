const User = require('../models/User.model');
const { ErrorResponse } = require('../middleware/error.middleware');
const { generateToken } = require('../middleware/auth.middleware');
const { sendEmail } = require('../utils/email');
const { validateEmailForRegistration } = require('../utils/emailValidation');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate role
    if (!['entrepreneur', 'investor'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be entrepreneur or investor'
      });
    }

    // Validate email: format + no disposable/temporary addresses (must be real email)
    const emailValidation = validateEmailForRegistration(email);
    if (!emailValidation.valid) {
      return res.status(400).json({
        success: false,
        message: emailValidation.message
      });
    }

    // Create user with normalized email
    const user = await User.create({
      name,
      email: emailValidation.normalized,
      password,
      role
    });

    // Generate email verification token
    const verificationToken = user.getEmailVerificationToken();
    await user.save();

    // Send verification email to real inbox (SMTP must be configured in .env)
    try {
      await sendEmail({
        to: user.email,
        subject: 'PitchBridge - Verify Your Email',
        template: 'emailVerification',
        context: {
          name: user.name,
          verificationCode: verificationToken
        }
      });
    } catch (error) {
      console.error('Error sending verification email:', error);
      await User.findByIdAndDelete(user._id);
      return res.status(503).json({
        success: false,
        message: 'We could not send the verification email to this address. Please check your email and try again, or contact support if the problem continues.'
      });
    }

    // Create token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email for verification code.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        documentsUploaded: user.documentsUploaded,
        accountApproved: user.accountApproved
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check for user (email is stored lowercase in DB)
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    // Create token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        documentsUploaded: user.documentsUploaded,
        accountApproved: user.accountApproved,
        watchlist: user.watchlist,
        portfolio: user.portfolio
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify email
// @route   POST /api/v1/auth/verify-email
// @access  Public
exports.verifyEmail = async (req, res, next) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({
      email,
      emailVerificationToken: code,
      emailVerificationExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code'
      });
    }

    // Update user
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resend verification email
// @route   POST /api/v1/auth/resend-verification
// @access  Public
exports.resendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email already verified'
      });
    }

    // Generate new verification token
    const verificationToken = user.getEmailVerificationToken();
    await user.save();

    // Send verification email
    await sendEmail({
      to: user.email,
      subject: 'PitchBridge - Verify Your Email',
      template: 'emailVerification',
      context: {
        name: user.name,
        verificationCode: verificationToken
      }
    });

    res.status(200).json({
      success: true,
      message: 'Verification email sent'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('projects')
      .populate('watchlist')
      .populate('portfolio');

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

// @desc    Delete current user account
// @route   DELETE /api/v1/auth/me
// @access  Private
exports.deleteAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    await User.findByIdAndDelete(req.user.id);
    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/v1/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate reset token (simplified for demo)
    const resetToken = Math.random().toString(36).substring(7);
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
    await user.save();

    // Send email
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      template: 'passwordReset',
      context: {
        name: user.name,
        resetToken
      }
    });

    res.status(200).json({
      success: true,
      message: 'Password reset email sent'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   PUT /api/v1/auth/reset-password/:resetToken
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.resetToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/v1/auth/update-password
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    user.password = req.body.newPassword;
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
      token
    });
  } catch (error) {
    next(error);
  }
};


exports.uploadDocs = async (req, res, next) => {
  try {
    // Multer puts the files in req.files
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // documentTypes is sent by the frontend to map each uploaded file to a type
    let documentTypes = [];
    if (req.body?.documentTypes) {
      try {
        documentTypes = JSON.parse(req.body.documentTypes);
      } catch (e) {
        documentTypes = [];
      }
    }

    const files = req.files;
    if (!Array.isArray(documentTypes) || documentTypes.length !== files.length) {
      return res.status(400).json({
        success: false,
        message: 'Document types mismatch. Please retry upload.'
      });
    }

    const path = require('path');
    const uploadsRoot = path.join(__dirname, '../../uploads');
    const hostUrl = `${req.protocol}://${req.get('host')}`;

    // Replace existing docs of same type with latest upload
    const incomingTypes = new Set(documentTypes);
    user.documents = (user.documents || []).filter((d) => !incomingTypes.has(d.type));

    files.forEach((file, idx) => {
      const type = documentTypes[idx];
      const relative = path.relative(uploadsRoot, file.path).split(path.sep).join('/');
      const urlPath = `/uploads/${relative}`;
      const absoluteUrl = `${hostUrl}${urlPath}`;

      user.documents.push({
        type,
        status: 'pending',
        uploadDate: new Date(),
        azureUrl: absoluteUrl,
        fileName: file.originalname
      });
    });

    user.documentsUploaded = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Documents uploaded successfully. Awaiting admin approval.',
      user
    });
  } catch (error) {
    next(error);
  }
};