/**
 * QR Scanner and Validation Utility
 * Handles QR code scanning, decoding, and validation for attendance
 */

const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');

/**
 * Decode QR code data
 * @param {String} qrData - The raw QR code data (JSON string)
 * @returns {Object} - Decoded participant data
 */
const decodeQRCode = (qrData) => {
  try {
    const data = JSON.parse(qrData);
    
    // Validate required fields
    const requiredFields = ['participantId', 'name', 'email', 'registrationType'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Invalid QR code: Missing fields - ${missingFields.join(', ')}`);
    }
    
    return {
      participantId: data.participantId,
      name: data.name,
      email: data.email,
      registrationType: data.registrationType, // 'general', 'workshop', 'both'
      department: data.department || null,
      generatedAt: data.generatedAt || null,
      eventName: data.eventName || 'SHACKLES 2025'
    };
  } catch (error) {
    throw new Error(`Failed to decode QR code: ${error.message}`);
  }
};

/**
 * Validate participant exists and is verified
 * @param {String} participantId - The participant ID from QR code
 * @returns {Object} - User data with verification status
 */
const validateParticipant = async (participantId) => {
  try {
    // Find user by participant ID
    const user = await User.findOne({ participantId })
      .select('participantId name email phone college department registrationType paymentStatus qrCode verifiedAt');
    
    if (!user) {
      return {
        valid: false,
        error: 'INVALID_PARTICIPANT',
        message: 'Participant not found. Invalid QR code.'
      };
    }
    
    // Check if payment is verified
    if (user.paymentStatus !== 'verified') {
      return {
        valid: false,
        error: 'PAYMENT_NOT_VERIFIED',
        message: 'Payment not verified. Please contact registration desk.',
        participant: {
          id: user.participantId,
          name: user.name,
          email: user.email
        }
      };
    }
    
    return {
      valid: true,
      participant: {
        id: user.participantId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        college: user.college,
        department: user.department,
        registrationType: user.registrationType,
        verifiedAt: user.verifiedAt
      }
    };
  } catch (error) {
    throw new Error(`Failed to validate participant: ${error.message}`);
  }
};

/**
 * Check access permissions for event
 * @param {String} registrationType - User's registration type ('general', 'workshop', 'both')
 * @param {String} eventCategory - Event category ('technical', 'non-technical', 'workshop')
 * @param {String} eventId - Event/Workshop ID (optional, for specific event registration check)
 * @returns {Object} - Access permission result
 */
const checkEventAccess = async (registrationType, eventCategory, eventId = null) => {
  try {
    // Access control logic based on registration type
    const accessRules = {
      // Only workshop registrations
      'workshop': {
        allowed: ['workshop'],
        denied: ['technical', 'non-technical', 'special']
      },
      // Only general/event registrations
      'general': {
        allowed: ['technical', 'non-technical', 'special'],
        denied: ['workshop']
      },
      // Both registrations - full access
      'both': {
        allowed: ['technical', 'non-technical', 'special', 'workshop'],
        denied: []
      }
    };
    
    const rules = accessRules[registrationType];
    
    if (!rules) {
      return {
        allowed: false,
        error: 'INVALID_REGISTRATION_TYPE',
        message: 'Invalid registration type'
      };
    }
    
    // Check if event category is allowed
    const isAllowed = rules.allowed.includes(eventCategory);
    
    if (!isAllowed) {
      let deniedMessage = '';
      
      if (registrationType === 'workshop' && eventCategory !== 'workshop') {
        deniedMessage = `❌ ACCESS DENIED\n\nYou are registered only for WORKSHOPS.\nThis is a ${eventCategory.toUpperCase()} event.\n\nPlease register for general events to attend.`;
      } else if (registrationType === 'general' && eventCategory === 'workshop') {
        deniedMessage = `❌ ACCESS DENIED\n\nYou are registered only for GENERAL EVENTS.\nThis is a WORKSHOP.\n\nPlease register for workshops to attend.`;
      }
      
      return {
        allowed: false,
        error: 'ACCESS_DENIED',
        message: deniedMessage || `Access denied for ${eventCategory} events`,
        registrationType,
        eventCategory
      };
    }
    
    return {
      allowed: true,
      message: `✅ Access granted for ${eventCategory} event`,
      registrationType,
      eventCategory
    };
  } catch (error) {
    throw new Error(`Failed to check event access: ${error.message}`);
  }
};

/**
 * Check if user has specific event registration
 * @param {String} userId - User's MongoDB ID
 * @param {String} eventId - Event ID
 * @param {String} eventType - 'event' or 'workshop'
 * @returns {Object} - Registration check result
 */
const checkEventRegistration = async (userId, eventId, eventType) => {
  try {
    const query = {
      user: userId,
      verificationStatus: 'approved'
    };
    
    if (eventType === 'workshop') {
      query.workshop = eventId;
      query.type = 'workshop';
    } else {
      query.event = eventId;
      query.type = 'event';
    }
    
    const registration = await Registration.findOne(query)
      .populate('event', 'name category')
      .populate('workshop', 'name');
    
    if (!registration) {
      return {
        registered: false,
        error: 'NOT_REGISTERED',
        message: `You are not registered for this specific ${eventType}. Please register first.`
      };
    }
    
    return {
      registered: true,
      registration: {
        id: registration._id,
        registrationNumber: registration.registrationNumber,
        status: registration.status,
        eventName: eventType === 'workshop' 
          ? registration.workshop?.name 
          : registration.event?.name
      }
    };
  } catch (error) {
    throw new Error(`Failed to check event registration: ${error.message}`);
  }
};

/**
 * Complete QR scan validation
 * @param {String} qrData - Raw QR code data
 * @param {String} eventId - Event/Workshop ID being checked into
 * @param {String} eventType - 'event' or 'workshop'
 * @returns {Object} - Complete validation result
 */
const validateQRScan = async (qrData, eventId, eventType = 'event') => {
  try {
    // Step 1: Decode QR code
    const decodedData = decodeQRCode(qrData);
    
    // Step 2: Validate participant
    const participantValidation = await validateParticipant(decodedData.participantId);
    
    if (!participantValidation.valid) {
      return {
        success: false,
        step: 'PARTICIPANT_VALIDATION',
        ...participantValidation
      };
    }
    
    // Step 3: Get event/workshop details
    let eventDetails;
    if (eventType === 'workshop') {
      const Workshop = require('../models/Workshop');
      eventDetails = await Workshop.findById(eventId).select('name category');
      if (!eventDetails) {
        return {
          success: false,
          step: 'EVENT_VALIDATION',
          error: 'WORKSHOP_NOT_FOUND',
          message: 'Workshop not found'
        };
      }
    } else {
      eventDetails = await Event.findById(eventId).select('name category');
      if (!eventDetails) {
        return {
          success: false,
          step: 'EVENT_VALIDATION',
          error: 'EVENT_NOT_FOUND',
          message: 'Event not found'
        };
      }
    }
    
    // Step 4: Check access permissions
    const eventCategory = eventType === 'workshop' ? 'workshop' : eventDetails.category;
    const accessCheck = await checkEventAccess(
      participantValidation.participant.registrationType,
      eventCategory
    );
    
    if (!accessCheck.allowed) {
      return {
        success: false,
        step: 'ACCESS_CONTROL',
        participant: participantValidation.participant,
        event: {
          name: eventDetails.name,
          category: eventCategory
        },
        ...accessCheck
      };
    }
    
    // Step 5: Check specific event registration (optional - can be enabled/disabled)
    // Uncomment below if you want to enforce specific event registration
    /*
    const user = await User.findOne({ participantId: decodedData.participantId });
    const registrationCheck = await checkEventRegistration(user._id, eventId, eventType);
    
    if (!registrationCheck.registered) {
      return {
        success: false,
        step: 'EVENT_REGISTRATION',
        participant: participantValidation.participant,
        ...registrationCheck
      };
    }
    */
    
    // All validations passed!
    return {
      success: true,
      message: '✅ QR Code validated successfully',
      participant: participantValidation.participant,
      event: {
        id: eventId,
        name: eventDetails.name,
        category: eventCategory,
        type: eventType
      },
      accessGranted: true
    };
  } catch (error) {
    return {
      success: false,
      step: 'VALIDATION_ERROR',
      error: 'SCAN_ERROR',
      message: `QR scan failed: ${error.message}`
    };
  }
};

module.exports = {
  decodeQRCode,
  validateParticipant,
  checkEventAccess,
  checkEventRegistration,
  validateQRScan
};
