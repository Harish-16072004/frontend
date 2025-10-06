const Workshop = require('../models/Workshop');
const Registration = require('../models/Registration');

// @desc    Get all workshops
// @route   GET /api/v1/workshops
// @access  Public
exports.getWorkshops = async (req, res) => {
  try {
    const workshops = await Workshop.find({ isActive: true })
      .populate('instructor', 'name email')
      .populate('registrations')
      .sort('date');

    res.status(200).json({
      success: true,
      count: workshops.length,
      workshops: workshops,
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

// @desc    Register for a workshop
// @route   POST /api/v1/workshops/:id/register
// @access  Private
exports.registerWorkshop = async (req, res) => {
  try {
    const userId = req.user._id;
    const workshopId = req.params.id;

    // Get workshop details
    const workshop = await Workshop.findById(workshopId);
    if (!workshop) {
      return res.status(404).json({
        success: false,
        message: 'Workshop not found'
      });
    }

    // Check if workshop is active
    if (!workshop.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This workshop is not available for registration'
      });
    }

    // Check if workshop is full
    if (workshop.isFull()) {
      return res.status(400).json({
        success: false,
        message: 'Workshop is full. No more seats available.'
      });
    }

    // Check if registration deadline has passed
    if (!workshop.isRegistrationOpen()) {
      return res.status(400).json({
        success: false,
        message: 'Registration deadline has passed for this workshop'
      });
    }

    // Check if user already registered
    const existingRegistration = await Registration.findOne({
      user: userId,
      workshop: workshopId,
      type: 'workshop'
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this workshop'
      });
    }

    // Get user details for payment verification
    const User = require('../models/User');
    const user = await User.findById(userId);

    // Check if user has verified payment
    if (user.paymentStatus !== 'verified') {
      return res.status(403).json({
        success: false,
        message: 'Please complete payment verification before registering for workshops'
      });
    }

    // Check user's registration type (payment plan)
    const userPlan = user.registrationType; // 'workshop', 'general', or 'both'

    // Enforce workshop access based on payment plan
    if (userPlan === 'general') {
      return res.status(403).json({
        success: false,
        message: '🚫 ACCESS DENIED: General plan (₹299) only allows event registrations. Please upgrade to Workshop (₹199) or Both (₹499) plan to access workshops.'
      });
    }

    // Create registration
    const registrationNumber = `WS-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    const registration = await Registration.create({
      registrationNumber,
      user: userId,
      workshop: workshopId,
      type: 'workshop',
      amount: workshop.registrationFee,
      paymentStatus: 'paid', // Assuming user already paid symposium fee
      status: 'confirmed'
    });

    // Increment workshop participant count
    await workshop.incrementParticipants(1);

    res.status(201).json({
      success: true,
      message: `Successfully registered for ${workshop.title}!`,
      data: registration
    });
  } catch (error) {
    console.error('Workshop registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
