const Workshop = require('../models/Workshop');
const Registration = require('../models/Registration');

// @desc    Get all workshops
// @route   GET /api/v1/workshops
// @access  Public
exports.getWorkshops = async (req, res) => {
  try {
    const workshops = await Workshop.find({ isActive: true })
      .populate('instructor', 'name email')
      .sort('date');

    res.status(200).json({
      success: true,
      count: workshops.length,
      data: workshops
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single workshop
// @route   GET /api/v1/workshops/:id
// @access  Public
exports.getWorkshop = async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id)
      .populate('instructor', 'name email bio');

    if (!workshop) {
      return res.status(404).json({
        success: false,
        message: 'Workshop not found'
      });
    }

    res.status(200).json({
      success: true,
      data: workshop
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new workshop
// @route   POST /api/v1/workshops
// @access  Private/Admin
exports.createWorkshop = async (req, res) => {
  try {
    const workshop = await Workshop.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Workshop created successfully',
      data: workshop
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update workshop
// @route   PUT /api/v1/workshops/:id
// @access  Private/Admin
exports.updateWorkshop = async (req, res) => {
  try {
    const workshop = await Workshop.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!workshop) {
      return res.status(404).json({
        success: false,
        message: 'Workshop not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Workshop updated successfully',
      data: workshop
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete workshop
// @route   DELETE /api/v1/workshops/:id
// @access  Private/Admin
exports.deleteWorkshop = async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id);

    if (!workshop) {
      return res.status(404).json({
        success: false,
        message: 'Workshop not found'
      });
    }

    // Soft delete
    workshop.isActive = false;
    await workshop.save();

    res.status(200).json({
      success: true,
      message: 'Workshop deleted successfully',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get workshop registrations
// @route   GET /api/v1/workshops/:id/registrations
// @access  Private/Admin
exports.getWorkshopRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ 
      workshop: req.params.id,
      status: { $ne: 'cancelled' }
    })
      .populate('user', 'name email phone college')
      .populate('payment')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
