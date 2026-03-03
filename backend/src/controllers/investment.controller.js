const Investment = require('../models/Investment.model');
const Project = require('../models/Project.model');
const User = require('../models/User.model');

module.exports = {
  createInvestment: async (req, res, next) => {
    try {
      const { project, amount } = req.body;

      const projectDoc = await Project.findById(project);
      if (!projectDoc) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      const investment = await Investment.create({
        investor: req.user.id,
        project,
        amount,
        status: 'pending'
      });

      // Add to user's portfolio
      await User.findByIdAndUpdate(req.user.id, {
        $push: { portfolio: investment._id }
      });

      res.status(201).json({
        success: true,
        investment
      });
    } catch (error) {
      next(error);
    }
  },

  // @desc    Get investments
  // @route   GET /api/v1/investments/my-investments
  // @access  Private
  getInvestments: async (req, res, next) => {
    try {
      const query = req.user.role === 'investor' 
        ? { investor: req.user.id }
        : { project: { $in: req.user.projects } };

      const investments = await Investment.find(query)
        .populate('project')
        .populate('investor', 'name email verificationLevel');

      res.status(200).json({
        success: true,
        count: investments.length,
        investments
      });
    } catch (error) {
      next(error);
    }
  },

  // @desc    Get single investment
  // @route   GET /api/v1/investments/:id
  // @access  Private
  getInvestment: async (req, res, next) => {
    try {
      const investment = await Investment.findById(req.params.id)
        .populate('project')
        .populate('investor', 'name email');

      if (!investment) {
        return res.status(404).json({
          success: false,
          message: 'Investment not found'
        });
      }

      res.status(200).json({
        success: true,
        investment
      });
    } catch (error) {
      next(error);
    }
  },

  // @desc    Update investment status
  // @route   PUT /api/v1/investments/:id/status
  // @access  Private/Admin
  updateInvestmentStatus: async (req, res, next) => {
    try {
      const { status } = req.body;

      const investment = await Investment.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

      res.status(200).json({
        success: true,
        investment
      });
    } catch (error) {
      next(error);
    }
  },

  // @desc    Agree to investment terms
  // @route   PUT /api/v1/investments/:id/agree-terms
  // @access  Private/Investor
  agreeToTerms: async (req, res, next) => {
    try {
      const investment = await Investment.findById(req.params.id);

      if (!investment) {
        return res.status(404).json({
          success: false,
          message: 'Investment not found'
        });
      }

      if (investment.investor.toString() !== req.user.id) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized'
        });
      }

      investment.termsAgreed = true;
      investment.termsAgreedDate = Date.now();
      await investment.save();

      res.status(200).json({
        success: true,
        investment
      });
    } catch (error) {
      next(error);
    }
  }
};