const EventRegistration = require('../models/EventRegistration');
const Event = require('../models/Event');
const User = require('../models/User');

// @desc    Register for an event
// @route   POST /api/v1/events/:eventId/register
// @access  Private
exports.registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;
    const { teamMembers, isTeamEvent } = req.body;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Get user details to check registration type
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user's payment is verified
    if (user.paymentStatus !== 'verified') {
      return res.status(403).json({
        success: false,
        message: 'Your payment has not been verified yet. Please wait for admin approval.'
      });
    }

    // ✅ NEW: Check registration type restrictions
    if (!user.registrationType) {
      return res.status(403).json({
        success: false,
        message: 'Registration type not set. Please complete your payment and registration.'
      });
    }

    // Enforce registration plan restrictions
    const eventCategory = event.category; // 'technical', 'non-technical', 'special', 'workshop'
    const userPlan = user.registrationType; // 'general', 'workshop', 'both'

    if (userPlan === 'workshop' && eventCategory !== 'workshop') {
      return res.status(403).json({
        success: false,
        message: '🚫 ACCESS DENIED: You have a Workshop plan (₹199). This allows only workshop registrations. To register for events, please upgrade to General (₹299) or Both (₹499) plan.'
      });
    }

    if (userPlan === 'general' && eventCategory === 'workshop') {
      return res.status(403).json({
        success: false,
        message: '🚫 ACCESS DENIED: You have a General Events plan (₹299). This allows only event registrations. To register for workshops, please upgrade to Both (₹499) plan or purchase Workshop plan (₹199).'
      });
    }

    // 'both' plan has no restrictions - can register for anything

    // Check if user is already registered
    const existingRegistration = await EventRegistration.findOne({
      user: userId,
      event: eventId
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event'
      });
    }

    // Check if event has participant limit
    if (event.maxParticipants) {
      const currentParticipants = await EventRegistration.countDocuments({
        event: eventId,
        status: 'registered'
      });

      if (currentParticipants >= event.maxParticipants) {
        return res.status(400).json({
          success: false,
          message: 'Event is full. Registration closed.'
        });
      }
    }

    // Validate team registration if required
    if (event.isTeamEvent && (!teamMembers || teamMembers.length === 0)) {
      return res.status(400).json({
        success: false,
        message: 'This is a team event. Please provide team member details.'
      });
    }

    if (event.isTeamEvent && event.teamSize) {
      const totalMembers = (teamMembers?.length || 0) + 1; // +1 for the user
      if (totalMembers < event.teamSize.min || totalMembers > event.teamSize.max) {
        return res.status(400).json({
          success: false,
          message: `Team size must be between ${event.teamSize.min} and ${event.teamSize.max} members`
        });
      }
    }

    // Create registration
    const registration = await EventRegistration.create({
      user: userId,
      event: eventId,
      eventName: event.name,
      eventType: event.category, // ✅ Fixed: Use category (technical/non-technical/special) not type (individual/team)
      teamMembers: teamMembers || [],
      isTeamEvent: event.isTeamEvent || false,
      paymentRequired: event.registrationFee > 0,
      paymentStatus: event.registrationFee > 0 ? 'pending' : 'not-required'
    });

    // Populate user details
    await registration.populate('user', 'name email phone college department');
    await registration.populate('event', 'name type venue date time');

    res.status(201).json({
      success: true,
      message: 'Successfully registered for the event',
      data: registration
    });
  } catch (error) {
    console.error('Event registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's event registrations
// @route   GET /api/v1/events/my-registrations
// @access  Private
exports.getMyRegistrations = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    const filter = { user: userId };
    if (status) {
      filter.status = status;
    }

    const registrations = await EventRegistration.find(filter)
      .populate('event', 'name category type venue date time registrationFee')
      .sort('-registeredAt');

    console.log(`📋 Found ${registrations.length} registrations for user ${userId}`);
    registrations.forEach((reg, i) => {
      console.log(`  ${i + 1}. Event: ${reg.event?.name || 'N/A'} (Type: ${reg.eventType})`);
    });

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations
    });
  } catch (error) {
    console.error('Get registrations error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Cancel event registration
// @route   DELETE /api/v1/events/:eventId/register
// @access  Private
exports.cancelRegistration = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    const registration = await EventRegistration.findOne({
      user: userId,
      event: eventId
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    if (registration.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Registration is already cancelled'
      });
    }

    // Update status instead of deleting
    registration.status = 'cancelled';
    await registration.save();

    res.status(200).json({
      success: true,
      message: 'Registration cancelled successfully',
      data: registration
    });
  } catch (error) {
    console.error('Cancel registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get participants for an event (Admin only)
// @route   GET /api/v1/events/:eventId/participants
// @access  Private (Admin)
exports.getEventParticipants = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { status } = req.query;

    const filter = { event: eventId };
    if (status) {
      filter.status = status;
    } else {
      filter.status = 'registered'; // Default to registered participants
    }

    const participants = await EventRegistration.find(filter)
      .populate('user', 'name email phone college department year collegeLocation')
      .sort('registeredAt');

    // Get event details
    const event = await Event.findById(eventId);

    res.status(200).json({
      success: true,
      event: event ? {
        name: event.name,
        type: event.type,
        maxParticipants: event.maxParticipants
      } : null,
      count: participants.length,
      data: participants
    });
  } catch (error) {
    console.error('Get participants error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Check if user is registered for an event
// @route   GET /api/v1/events/:eventId/check-registration
// @access  Private
exports.checkRegistration = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    const registration = await EventRegistration.findOne({
      user: userId,
      event: eventId,
      status: 'registered'
    });

    res.status(200).json({
      success: true,
      isRegistered: !!registration,
      data: registration || null
    });
  } catch (error) {
    console.error('Check registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all event registrations with filters (Admin)
// @route   GET /api/v1/events/registrations/all
// @access  Private (Admin)
exports.getAllRegistrations = async (req, res) => {
  try {
    const { eventType, status, search } = req.query;

    const filter = {};
    if (eventType) filter.eventType = eventType;
    if (status) filter.status = status;

    let registrations = await EventRegistration.find(filter)
      .populate('user', 'name email phone college department')
      .populate('event', 'name type venue date')
      .sort('-registeredAt');

    // Search by name or email if provided
    if (search) {
      registrations = registrations.filter(reg => 
        reg.user.name.toLowerCase().includes(search.toLowerCase()) ||
        reg.user.email.toLowerCase().includes(search.toLowerCase()) ||
        reg.eventName.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations
    });
  } catch (error) {
    console.error('Get all registrations error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
