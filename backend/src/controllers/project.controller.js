const Project = require('../models/Project.model');
const User = require('../models/User.model');

exports.getProjects = async (req, res, next) => {
  try {
    const { category, location, status, page = 1, limit = 12 } = req.query;

    // 1. Start with an empty filter
    let filter = {};

    // 2. Handle Status (Crucial: If no status is sent, show all public types)
    if (status) {
      filter.status = status;
    } else {
      filter.status = { $in: ['active', 'approved', 'published'] };
    }

    // 3. Handle Category (Only add if it's not 'all')
    if (category && category !== 'all') {
      // We use a case-insensitive match to be safe
      filter.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    // 4. Handle Location
    if (location) {
      filter.location = { $regex: new RegExp(location, 'i') };
    }

    console.log("Active Filter:", filter); // Check your terminal to see what's being searched!

    const projects = await Project.find(filter)
      .populate('entrepreneur', 'name verificationLevel')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Project.countDocuments(filter);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      projects
    });
  } catch (error) {
    next(error);
  }
};

exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('entrepreneur', 'name email bio verificationLevel verified location');

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

// @desc    Create new project
// @route   POST /api/v1/projects
// @access  Private/Entrepreneur
exports.createProject = async (req, res, next) => {
  try {
    req.body.entrepreneur = req.user.id;
    req.body.status = 'pending';
    req.body.approvalStatus = 'pending';

    const project = await Project.create(req.body);

    // Add project to user's projects
    await User.findByIdAndUpdate(req.user.id, {
      $push: { projects: project._id }
    });

    res.status(201).json({
      success: true,
      project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/v1/projects/:id
// @access  Private/Entrepreneur
exports.updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Make sure user is project owner
    if (project.entrepreneur.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this project'
      });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/v1/projects/:id
// @access  Private/Entrepreneur
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (project.entrepreneur.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this project'
      });
    }

    await project.deleteOne();

    // Remove from user's projects
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { projects: req.params.id }
    });

    res.status(200).json({
      success: true,
      message: 'Project deleted'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search projects
// @route   GET /api/v1/projects/search
// @access  Public
exports.searchProjects = async (req, res, next) => {
  try {
    const { q } = req.query;

    const projects = await Project.find({
      $text: { $search: q },
      status: 'approved'
    }).populate('entrepreneur', 'name verificationLevel');

    res.status(200).json({
      success: true,
      count: projects.length,
      projects
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get entrepreneur's projects
// @route   GET /api/v1/projects/my/projects
// @access  Private/Entrepreneur
exports.getMyProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ entrepreneur: req.user.id });

    res.status(200).json({
      success: true,
      count: projects.length,
      projects
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Increment project views
// @route   POST /api/v1/projects/:id/view
// @access  Public
exports.incrementViews = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      await project.incrementViews();
    }

    res.status(200).json({
      success: true
    });
  } catch (error) {
    next(error);
  }
};