const User = require('../models/User.model');
const Project = require('../models/Project.model');
const Investment = require('../models/Investment.model');

// @desc    Get pending project verifications
// @route   GET /api/v1/admin/verifications/pending
// @access  Private/Admin
exports.getPendingVerifications = async (req, res, next) => {
  try {
    const projects = await Project.find({ approvalStatus: 'pending' })
      .populate('entrepreneur', 'name email verified documents verificationLevel')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      projects
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get project verification details
// @route   GET /api/v1/admin/verifications/:id
// @access  Private/Admin
exports.getVerificationDetails = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('entrepreneur');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve project
// @route   PUT /api/v1/admin/verifications/:id/approve
// @access  Private/Admin
exports.approveProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        approvalStatus: 'approved',
        status: 'active',
        verified: { nid: true, rdb: true }
      },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Update user account approval
    await User.findByIdAndUpdate(project.entrepreneur, {
      accountApproved: true
    });

    res.status(200).json({
      success: true,
      message: 'Project approved',
      project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject project
// @route   PUT /api/v1/admin/verifications/:id/reject
// @access  Private/Admin
exports.rejectProject = async (req, res, next) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        approvalStatus: 'rejected',
        status: 'rejected',
        rejectionReason: reason
      },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project rejected',
      project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Request clarification
// @route   PUT /api/v1/admin/verifications/:id/clarification
// @access  Private/Admin
exports.requestClarification = async (req, res, next) => {
  try {
    const { note } = req.body;

    if (!note) {
      return res.status(400).json({
        success: false,
        message: 'Clarification note is required'
      });
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        approvalStatus: 'clarification_needed',
        $push: {
          adminNotes: {
            note,
            addedBy: req.user.id,
            date: Date.now()
          }
        }
      },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Clarification requested',
      project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pending user verifications (users with documents uploaded but not approved)
// @route   GET /api/v1/admin/users/pending
// @access  Private/Admin
exports.getPendingUsers = async (req, res, next) => {
  try {
    const users = await User.find({ 
      documentsUploaded: true, 
      accountApproved: false,
      role: { $ne: 'admin' }
    })
    .select('-password')
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/v1/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user details with documents
// @route   GET /api/v1/admin/users/:id
// @access  Private/Admin
exports.getUserDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve entire user account
// @route   PUT /api/v1/admin/users/:id/approve
// @access  Private/Admin
exports.approveUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Update approval flags
    user.accountApproved = true;

    // Approve all pending documents
    if (user.documents && user.documents.length > 0) {
      user.documents.forEach(doc => {
        if (doc.status === 'pending') {
          doc.status = 'approved';
        }
      });
    }

    // Set verified flags based on approved documents
    const hasNID = user.documents.some(doc => doc.type === 'nid' && doc.status === 'approved');
    const hasTIN = user.documents.some(doc => doc.type === 'tin' && doc.status === 'approved');
    const hasRDB = user.documents.some(doc => doc.type === 'rdb' && doc.status === 'approved');

    user.verified.nid = hasNID;
    user.verified.tin = hasTIN;
    user.verified.rdb = hasRDB;

    // Update verification level (model enum is lowercase)
    if (hasNID && hasTIN && hasRDB) {
      user.verificationLevel = 'gold';
    } else if (hasNID && hasTIN) {
      user.verificationLevel = 'silver';
    } else if (hasNID) {
      user.verificationLevel = 'bronze';
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.name} has been approved`,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject entire user account
// @route   PUT /api/v1/admin/users/:id/reject
// @access  Private/Admin
exports.rejectUser = async (req, res, next) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Reject all documents
    if (user.documents && user.documents.length > 0) {
      user.documents.forEach(doc => {
        doc.status = 'rejected';
        doc.rejectionReason = reason;
      });
    }

    user.accountApproved = false;
    user.accountStatus = 'suspended';

    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.name} has been rejected`,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve individual user document
// @route   PUT /api/v1/admin/documents/:userId/:documentId/approve
// @access  Private/Admin
exports.approveDocument = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const document = user.documents.id(req.params.documentId);
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Approve document
    document.status = 'approved';
    document.rejectionReason = undefined;
    
    // Update verified status
    user.verified[document.type] = true;

    // Update verification level
    const hasNID = user.documents.some(doc => doc.type === 'nid' && doc.status === 'approved');
    const hasTIN = user.documents.some(doc => doc.type === 'tin' && doc.status === 'approved');
    const hasRDB = user.documents.some(doc => doc.type === 'rdb' && doc.status === 'approved');

    if (hasNID && hasTIN && hasRDB) {
      user.verificationLevel = 'gold';
    } else if (hasNID && hasTIN) {
      user.verificationLevel = 'silver';
    } else if (hasNID) {
      user.verificationLevel = 'bronze';
    }
    
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Document approved',
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject individual user document
// @route   PUT /api/v1/admin/documents/:userId/:documentId/reject
// @access  Private/Admin
exports.rejectDocument = async (req, res, next) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }

    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const document = user.documents.id(req.params.documentId);
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Reject document
    document.status = 'rejected';
    document.rejectionReason = reason;
    
    // Update verified status
    user.verified[document.type] = false;
    
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Document rejected',
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Suspend user account
// @route   PUT /api/v1/admin/users/:id/suspend
// @access  Private/Admin
exports.suspendUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { accountStatus: 'suspended' },
      { new: true, select: '-password' }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User suspended',
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Activate user account
// @route   PUT /api/v1/admin/users/:id/activate
// @access  Private/Admin
exports.activateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { accountStatus: 'active' },
      { new: true, select: '-password' }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User activated',
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get platform statistics
// @route   GET /api/v1/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEntrepreneurs = await User.countDocuments({ role: 'entrepreneur' });
    const totalInvestors = await User.countDocuments({ role: 'investor' });
    const totalProjects = await Project.countDocuments();
    const totalInvestments = await Investment.countDocuments();
    const pendingVerifications = await Project.countDocuments({ approvalStatus: 'pending' });
    const pendingUsers = await User.countDocuments({ 
      documentsUploaded: true, 
      accountApproved: false,
      role: { $ne: 'admin' }
    });
    const activeProjects = await Project.countDocuments({ status: 'active' });
    const completedProjects = await Project.countDocuments({ status: 'completed' });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalEntrepreneurs,
        totalInvestors,
        totalProjects,
        activeProjects,
        completedProjects,
        totalInvestments,
        pendingVerifications,
        pendingUsers
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;