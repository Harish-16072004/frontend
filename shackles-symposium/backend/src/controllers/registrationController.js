const Registration = require('../models/Registration');
const Event = require('../models/Event');
const Workshop = require('../models/Workshop');
const generateQR = require('../utils/qrGenerator');
const generatePDF = require('../utils/pdfGenerator');

// @desc    Create new registration
// @route   POST /api/v1/registrations
// @access  Private
exports.createRegistration = async (req, res) => {
  try {
    const { eventId, workshopId, teamMembers, accommodationRequired } = req.body;

    // Check if event or workshop exists
    let event, workshop;
    if (eventId) {
      event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Event not found'
        });
      }

      // Check if seats available
      if (event.registeredCount >= event.maxParticipants) {
        return res.status(400).json({
          success: false,
          message: 'Event is full'
        });
      }
    }

    if (workshopId) {
      workshop = await Workshop.findById(workshopId);
      if (!workshop) {
        return res.status(404).json({
          success: false,
          message: 'Workshop not found'
        });
      }

      // Check if seats available
      if (workshop.registeredCount >= workshop.maxParticipants) {
        return res.status(400).json({
          success: false,
          message: 'Workshop is full'
        });
      }
    }

    // Create registration
    const registration = await Registration.create({
      user: req.user.id,
      event: eventId,
      workshop: workshopId,
      teamMembers,
      accommodationRequired,
      status: 'pending'
    });

    // Generate QR code
    const qrCode = await generateQR(registration._id.toString());
    registration.qrCode = qrCode;
    await registration.save();

    // Populate the registration
    await registration.populate('event workshop user');

    res.status(201).json({
      success: true,
      message: 'Registration created successfully. Please complete payment.',
      data: registration
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all registrations (Admin)
// @route   GET /api/v1/registrations
// @access  Private/Admin
exports.getRegistrations = async (req, res) => {
  try {
    const { status, event, workshop } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (event) filter.event = event;
    if (workshop) filter.workshop = workshop;

    const registrations = await Registration.find(filter)
      .populate('user', 'name email phone college')
      .populate('event', 'name category')
      .populate('workshop', 'title')
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

// @desc    Get current user's registrations
// @route   GET /api/v1/registrations/my-registrations
// @access  Private
exports.getUserRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user.id })
      .populate('event', 'name category date venue fees')
      .populate('workshop', 'title date venue fees')
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

// @desc    Get single registration
// @route   GET /api/v1/registrations/:id
// @access  Private
exports.getRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id)
      .populate('user', 'name email phone college')
      .populate('event')
      .populate('workshop')
      .populate('payment');

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    // Check if user owns this registration or is admin
    if (registration.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    res.status(200).json({
      success: true,
      data: registration
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update registration
// @route   PUT /api/v1/registrations/:id
// @access  Private/Admin
exports.updateRegistration = async (req, res) => {
  try {
    const registration = await Registration.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Registration updated successfully',
      data: registration
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete registration
// @route   DELETE /api/v1/registrations/:id
// @access  Private/Admin
exports.deleteRegistration = async (req, res) => {
  try {
    const registration = await Registration.findByIdAndDelete(req.params.id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Registration deleted successfully',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Cancel registration
// @route   POST /api/v1/registrations/:id/cancel
// @access  Private
exports.cancelRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    // Check if user owns this registration
    if (registration.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Check if can be cancelled (e.g., not within 24 hours of event)
    if (registration.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Registration is already cancelled'
      });
    }

    registration.status = 'cancelled';
    await registration.save();

    res.status(200).json({
      success: true,
      message: 'Registration cancelled successfully',
      data: registration
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Download registration ticket
// @route   GET /api/v1/registrations/:id/download-ticket
// @access  Private
exports.downloadTicket = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id)
      .populate('user')
      .populate('event')
      .populate('workshop');

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    // Check if user owns this registration
    if (registration.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Check if payment is completed
    if (registration.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        message: 'Payment not completed. Cannot download ticket.'
      });
    }

    // Generate PDF ticket
    const pdfBuffer = await generatePDF(registration);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=ticket-${registration.registrationNumber}.pdf`);
    res.send(pdfBuffer);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
