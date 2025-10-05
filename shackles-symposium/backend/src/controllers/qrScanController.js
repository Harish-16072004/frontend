/**
 * QR Scan & Attendance Controller
 * Handles QR code scanning, access control, attendance marking, and kit distribution
 */

const Attendance = require('../models/Attendance');
const User = require('../models/User');
const Event = require('../models/Event');
const KitDistribution = require('../models/KitDistribution');
const { validateQRScan, decodeQRCode } = require('../utils/qrScanner');

/**
 * @desc    Scan QR code for event check-in with access control
 * @route   POST /api/v1/attendance/scan-qr
 * @access  Private (Coordinator/Admin)
 */
exports.scanQRCode = async (req, res) => {
  try {
    const { qrData, eventId, eventType = 'event' } = req.body;
    
    if (!qrData || !eventId) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_FIELDS',
        message: 'QR data and event ID are required'
      });
    }
    
    // Validate QR code and check access permissions
    const validation = await validateQRScan(qrData, eventId, eventType);
    
    if (!validation.success) {
      return res.status(403).json({
        success: false,
        ...validation
      });
    }
    
    // Get full user details
    const user = await User.findOne({ participantId: validation.participant.id });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'USER_NOT_FOUND',
        message: 'User not found'
      });
    }
    
    // Check if already checked in for this event
    const query = {
      user: user._id,
      checkOutTime: null // Not yet checked out
    };
    
    if (eventType === 'workshop') {
      query.workshop = eventId;
    } else {
      query.event = eventId;
    }
    
    const existingAttendance = await Attendance.findOne(query);
    
    if (existingAttendance) {
      return res.status(200).json({
        success: true,
        alreadyCheckedIn: true,
        message: '⚠️ Already checked in for this event',
        participant: validation.participant,
        event: validation.event,
        attendance: {
          checkInTime: existingAttendance.checkInTime,
          checkInBy: existingAttendance.checkInBy
        }
      });
    }
    
    // All validations passed - return scan result for confirmation
    res.status(200).json({
      success: true,
      message: '✅ QR Code validated successfully',
      participant: {
        ...validation.participant,
        fullName: user.name,
        college: user.college,
        department: user.department,
        phone: user.phone
      },
      event: validation.event,
      accessGranted: true,
      readyForCheckIn: true
    });
  } catch (error) {
    console.error('QR scan error:', error);
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: `QR scan failed: ${error.message}`
    });
  }
};

/**
 * @desc    Check in participant after QR validation
 * @route   POST /api/v1/attendance/check-in
 * @access  Private (Coordinator/Admin)
 */
exports.checkInParticipant = async (req, res) => {
  try {
    const { participantId, eventId, eventType = 'event', location, deviceInfo } = req.body;
    
    if (!participantId || !eventId) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_FIELDS',
        message: 'Participant ID and event ID are required'
      });
    }
    
    // Get user
    const user = await User.findOne({ participantId });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'USER_NOT_FOUND',
        message: 'User not found'
      });
    }
    
    // Create attendance record
    const attendanceData = {
      user: user._id,
      checkInTime: new Date(),
      checkInMethod: 'qr',
      checkInBy: req.user.id,
      location,
      deviceInfo
    };
    
    if (eventType === 'workshop') {
      attendanceData.workshop = eventId;
    } else {
      attendanceData.event = eventId;
    }
    
    // Check if there's a registration for this event
    const Registration = require('../models/Registration');
    const registrationQuery = {
      user: user._id,
      verificationStatus: 'approved'
    };
    
    if (eventType === 'workshop') {
      registrationQuery.workshop = eventId;
    } else {
      registrationQuery.event = eventId;
    }
    
    const registration = await Registration.findOne(registrationQuery);
    
    if (registration) {
      attendanceData.registration = registration._id;
    }
    
    const attendance = await Attendance.create(attendanceData);
    
    // Populate attendance with full details
    await attendance.populate([
      { path: 'user', select: 'participantId name email phone college department' },
      { path: 'event', select: 'name category venue' },
      { path: 'workshop', select: 'name category venue' },
      { path: 'checkInBy', select: 'name email' }
    ]);
    
    res.status(201).json({
      success: true,
      message: '✅ Check-in successful',
      attendance: {
        id: attendance._id,
        participant: {
          id: user.participantId,
          name: user.name,
          email: user.email,
          college: user.college
        },
        event: attendance.event || attendance.workshop,
        checkInTime: attendance.checkInTime,
        checkInBy: attendance.checkInBy
      }
    });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: `Check-in failed: ${error.message}`
    });
  }
};

/**
 * @desc    Issue registration kit after QR scan
 * @route   POST /api/v1/attendance/issue-kit
 * @access  Private (Coordinator/Admin)
 */
exports.issueKit = async (req, res) => {
  try {
    const { 
      participantId, 
      collectionPoint = 'main-desk',
      signature,
      deviceInfo 
    } = req.body;
    
    if (!participantId) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_PARTICIPANT_ID',
        message: 'Participant ID is required'
      });
    }
    
    // Get user
    const user = await User.findOne({ participantId })
      .select('participantId name email phone college department registrationType paymentStatus');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'USER_NOT_FOUND',
        message: 'Participant not found'
      });
    }
    
    // Verify payment status
    if (user.paymentStatus !== 'verified') {
      return res.status(403).json({
        success: false,
        error: 'PAYMENT_NOT_VERIFIED',
        message: 'Payment not verified. Cannot issue kit.'
      });
    }
    
    // Check if kit already issued
    const existingKit = await KitDistribution.isKitIssued(participantId);
    
    if (existingKit) {
      const kitDetails = await KitDistribution.getKitDetails(participantId);
      return res.status(200).json({
        success: true,
        alreadyIssued: true,
        message: '⚠️ Kit already issued to this participant',
        kit: {
          issuedAt: kitDetails.issuedAt,
          issuedBy: kitDetails.issuedBy,
          idCardNumber: kitDetails.idCardNumber,
          contents: kitDetails.kitContents
        }
      });
    }
    
    // Get kit contents based on registration type
    const kitContents = KitDistribution.getKitContentsByType(user.registrationType);
    
    // Create kit distribution record
    const kit = await KitDistribution.create({
      participantId: user.participantId,
      user: user._id,
      kitType: user.registrationType,
      kitContents,
      issuedBy: req.user.id,
      issuanceMethod: 'qr-scan',
      collectionPoint,
      participantSignature: signature,
      deviceInfo
    });
    
    // Populate kit details
    await kit.populate([
      { path: 'user', select: 'participantId name email phone college department' },
      { path: 'issuedBy', select: 'name email' }
    ]);
    
    res.status(201).json({
      success: true,
      message: '✅ Registration kit issued successfully',
      kit: {
        id: kit._id,
        idCardNumber: kit.idCardNumber,
        participant: {
          id: user.participantId,
          name: user.name,
          college: user.college,
          registrationType: user.registrationType
        },
        contents: kit.kitContents,
        issuedAt: kit.issuedAt,
        issuedBy: kit.issuedBy
      }
    });
  } catch (error) {
    console.error('Kit issuance error:', error);
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: `Kit issuance failed: ${error.message}`
    });
  }
};

/**
 * @desc    Combined QR scan: Check-in + Kit issuance
 * @route   POST /api/v1/attendance/scan-and-checkin
 * @access  Private (Coordinator/Admin)
 */
exports.scanAndCheckIn = async (req, res) => {
  try {
    const { 
      qrData, 
      eventId, 
      eventType = 'event',
      issueKit = false,
      collectionPoint = 'main-desk',
      signature,
      location,
      deviceInfo 
    } = req.body;
    
    if (!qrData || !eventId) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_FIELDS',
        message: 'QR data and event ID are required'
      });
    }
    
    // Step 1: Validate QR code
    const validation = await validateQRScan(qrData, eventId, eventType);
    
    if (!validation.success) {
      return res.status(403).json({
        success: false,
        ...validation
      });
    }
    
    const user = await User.findOne({ participantId: validation.participant.id });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'USER_NOT_FOUND',
        message: 'User not found'
      });
    }
    
    const result = {
      participant: validation.participant,
      event: validation.event
    };
    
    // Step 2: Check-in
    const attendanceData = {
      user: user._id,
      checkInTime: new Date(),
      checkInMethod: 'qr',
      checkInBy: req.user.id,
      location,
      deviceInfo
    };
    
    if (eventType === 'workshop') {
      attendanceData.workshop = eventId;
    } else {
      attendanceData.event = eventId;
    }
    
    // Check for existing attendance
    const query = {
      user: user._id,
      checkOutTime: null
    };
    
    if (eventType === 'workshop') {
      query.workshop = eventId;
    } else {
      query.event = eventId;
    }
    
    let attendance = await Attendance.findOne(query);
    
    if (!attendance) {
      // Find registration if exists
      const Registration = require('../models/Registration');
      const registrationQuery = {
        user: user._id,
        verificationStatus: 'approved'
      };
      
      if (eventType === 'workshop') {
        registrationQuery.workshop = eventId;
      } else {
        registrationQuery.event = eventId;
      }
      
      const registration = await Registration.findOne(registrationQuery);
      
      if (registration) {
        attendanceData.registration = registration._id;
      }
      
      attendance = await Attendance.create(attendanceData);
      result.checkIn = {
        status: 'success',
        checkInTime: attendance.checkInTime,
        message: '✅ Checked in successfully'
      };
    } else {
      result.checkIn = {
        status: 'already_checked_in',
        checkInTime: attendance.checkInTime,
        message: '⚠️ Already checked in'
      };
    }
    
    // Step 3: Issue kit (if requested)
    if (issueKit) {
      const existingKit = await KitDistribution.isKitIssued(validation.participant.id);
      
      if (!existingKit) {
        const kitContents = KitDistribution.getKitContentsByType(user.registrationType);
        
        const kit = await KitDistribution.create({
          participantId: user.participantId,
          user: user._id,
          kitType: user.registrationType,
          kitContents,
          issuedBy: req.user.id,
          issuanceMethod: 'qr-scan',
          collectionPoint,
          participantSignature: signature,
          deviceInfo
        });
        
        result.kit = {
          status: 'issued',
          idCardNumber: kit.idCardNumber,
          contents: kit.kitContents,
          message: '✅ Kit issued successfully'
        };
      } else {
        const kitDetails = await KitDistribution.getKitDetails(validation.participant.id);
        result.kit = {
          status: 'already_issued',
          idCardNumber: kitDetails.idCardNumber,
          issuedAt: kitDetails.issuedAt,
          message: '⚠️ Kit already issued'
        };
      }
    }
    
    res.status(200).json({
      success: true,
      message: '✅ QR scan completed successfully',
      ...result
    });
  } catch (error) {
    console.error('Scan and check-in error:', error);
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: `Operation failed: ${error.message}`
    });
  }
};

/**
 * @desc    Check kit distribution status
 * @route   GET /api/v1/attendance/kit-status/:participantId
 * @access  Private (Coordinator/Admin)
 */
exports.getKitStatus = async (req, res) => {
  try {
    const { participantId } = req.params;
    
    const user = await User.findOne({ participantId })
      .select('participantId name email registrationType paymentStatus');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'USER_NOT_FOUND',
        message: 'Participant not found'
      });
    }
    
    const kitDetails = await KitDistribution.getKitDetails(participantId);
    
    if (!kitDetails) {
      return res.status(200).json({
        success: true,
        kitIssued: false,
        participant: {
          id: user.participantId,
          name: user.name,
          registrationType: user.registrationType
        },
        message: 'Kit not yet issued'
      });
    }
    
    res.status(200).json({
      success: true,
      kitIssued: true,
      kit: {
        idCardNumber: kitDetails.idCardNumber,
        kitType: kitDetails.kitType,
        contents: kitDetails.kitContents,
        issuedAt: kitDetails.issuedAt,
        issuedBy: kitDetails.issuedBy,
        collectionPoint: kitDetails.collectionPoint
      },
      participant: {
        id: user.participantId,
        name: user.name,
        email: user.email,
        registrationType: user.registrationType
      }
    });
  } catch (error) {
    console.error('Get kit status error:', error);
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: `Failed to get kit status: ${error.message}`
    });
  }
};

/**
 * @desc    Get participant attendance history
 * @route   GET /api/v1/attendance/history/:participantId
 * @access  Private (Coordinator/Admin)
 */
exports.getAttendanceHistory = async (req, res) => {
  try {
    const { participantId } = req.params;
    
    const user = await User.findOne({ participantId });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'USER_NOT_FOUND',
        message: 'Participant not found'
      });
    }
    
    const attendance = await Attendance.find({ user: user._id })
      .populate('event', 'name category venue date')
      .populate('workshop', 'name category venue date')
      .populate('checkInBy', 'name email')
      .sort({ checkInTime: -1 });
    
    res.status(200).json({
      success: true,
      count: attendance.length,
      participant: {
        id: user.participantId,
        name: user.name,
        registrationType: user.registrationType
      },
      attendance
    });
  } catch (error) {
    console.error('Get attendance history error:', error);
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: `Failed to get attendance history: ${error.message}`
    });
  }
};

