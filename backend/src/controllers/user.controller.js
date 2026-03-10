const User = require('../models/User.model');
const Project = require('../models/Project.model');
const Investment = require('../models/Investment.model');


exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.params.id || req.user.id;
    
    const user = await User.findById(userId)
      .select('-password')
      .populate('projects')
      .populate('watchlist');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // If viewing own profile or admin, show all details
    const isOwnProfile = userId === req.user.id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwnProfile && !isAdmin) {
      // Remove sensitive information for public view
      user.email = undefined;
      user.phone = undefined;
      user.documents = undefined;
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.phone,
      bio: req.body.bio,
      location: req.body.location,
      preferredSectors: req.body.preferredSectors
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(
      key => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

exports.uploadProfilePicture = async (req, res, next) => {
  try {
    if (!req.file) return next(new Error('No file uploaded'));
    

    const imageUrl = req.file.path; // Cloudinary returns the full URL

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: imageUrl },
      { new: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      profilePicture: user.profilePicture
    });
  } catch (error) {
    next(error);
  }
};

exports.addToWatchlist = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const user = await User.findById(req.user.id);

    // Check if already in watchlist
    if (user.watchlist.includes(req.params.projectId)) {
      return res.status(400).json({
        success: false,
        message: 'Project already in watchlist'
      });
    }

    user.watchlist.push(req.params.projectId);
    await user.save();

    // Update project watchlist count
    project.watchlistCount += 1;
    await project.save();

    res.status(200).json({
      success: true,
      message: 'Project added to watchlist',
      watchlist: user.watchlist
    });
  } catch (error) {
    next(error);
  }
};

exports.removeFromWatchlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    user.watchlist = user.watchlist.filter(
      id => id.toString() !== req.params.projectId
    );
    await user.save();

    // Update project watchlist count
    const project = await Project.findById(req.params.projectId);
    if (project && project.watchlistCount > 0) {
      project.watchlistCount -= 1;
      await project.save();
    }

    res.status(200).json({
      success: true,
      message: 'Project removed from watchlist',
      watchlist: user.watchlist
    });
  } catch (error) {
    next(error);
  }
};

exports.getWatchlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'watchlist',
      populate: {
        path: 'entrepreneur',
        select: 'name verificationLevel'
      }
    });

    res.status(200).json({
      success: true,
      count: user.watchlist.length,
      watchlist: user.watchlist
    });
  } catch (error) {
    next(error);
  }
};


exports.getPortfolio = async (req, res, next) => {
  try {
    const investments = await Investment.find({ 
      investor: req.user.id,
      status: { $in: ['approved', 'completed'] }
    }).populate({
      path: 'project',
      populate: {
        path: 'entrepreneur',
        select: 'name verificationLevel'
      }
    });

    res.status(200).json({
      success: true,
      count: investments.length,
      portfolio: investments
    });
  } catch (error) {
    next(error);
  }
};



exports.addProjectToPortfolio = async (req, res, next) => {
  try {
    const { projectId } = req.body;

    // We create a "pending" investment record to represent the connection request
    const investment = await Investment.create({
      project: projectId,
      investor: req.user.id,
      amount: 0, // 0 for now as it's just a connection
      status: 'approved' // We set to approved so your existing getPortfolio finds it
    });

    res.status(201).json({
      success: true,
      data: investment
    });
  } catch (error) {
    next(error);
  }
};