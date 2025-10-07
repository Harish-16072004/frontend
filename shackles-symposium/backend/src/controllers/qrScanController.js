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
 * @desc    Issue registration kit after QR scan (Workshop Day or Events Day)
 * @route   POST /api/v1/qr-scan/issue-kit
 * @access  Private (Coordinator/Admin)
 */
exports.issueKit = async (req, res) => {
  try {
    const { 
      participantId,
      kitDay, // 'workshop' or 'events'
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
    
    if (!kitDay || !['workshop', 'events'].includes(kitDay)) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_KIT_DAY',
        message: 'Kit day must be either "workshop" or "events"'
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
    
    // Get or create kit distribution record
    let kitRecord = await KitDistribution.findOne({ participantId });
    
    if (!kitRecord) {
      kitRecord = new KitDistribution({
        participantId: user.participantId,
        user: user._id,
        registrationType: user.registrationType
      });
    }
    
    // Check eligibility and issue appropriate kit
    if (kitDay === 'workshop') {
      // Check eligibility for workshop kit
      if (!kitRecord.canReceiveWorkshopKit()) {
        return res.status(403).json({
          success: false,
          error: 'NOT_ELIGIBLE_WORKSHOP',
          message: `❌ Not eligible for workshop day kit.\n\nYou are registered as: ${user.registrationType.toUpperCase()}\n\nOnly WORKSHOP or BOTH registrations can receive workshop day kit.`
        });
      }
      
      // Check if already issued
      if (kitRecord.workshopDayKit.issued) {
        return res.status(200).json({
          success: true,
          alreadyIssued: true,
          message: '⚠️ Workshop day kit already issued to this participant',
          kit: {
            idCardNumber: kitRecord.workshopDayKit.idCardNumber,
            issuedAt: kitRecord.workshopDayKit.issuedAt,
            contents: kitRecord.workshopDayKit.contents
          }
        });
      }
      
      // Issue workshop day kit
      const workshopContents = KitDistribution.getWorkshopDayKitContents();
      kitRecord.workshopDayKit = {
        issued: true,
        issuedAt: new Date(),
        issuedBy: req.user.id,
        contents: workshopContents,
        issuanceMethod: 'qr-scan',
        collectionPoint: collectionPoint || 'workshop-desk',
        participantSignature: signature,
        deviceInfo
      };
      
      await kitRecord.save();
      
      // Populate details
      await kitRecord.populate([
        { path: 'user', select: 'participantId name email phone college' },
        { path: 'workshopDayKit.issuedBy', select: 'name email' }
      ]);
      
      return res.status(201).json({
        success: true,
        message: '✅ Workshop day kit issued successfully',
        kit: {
          id: kitRecord._id,
          kitDay: 'workshop',
          idCardNumber: kitRecord.workshopDayKit.idCardNumber,
          participant: {
            id: user.participantId,
            name: user.name,
            college: user.college,
            registrationType: user.registrationType
          },
          contents: kitRecord.workshopDayKit.contents,
          issuedAt: kitRecord.workshopDayKit.issuedAt,
          issuedBy: kitRecord.workshopDayKit.issuedBy
        }
      });
      
    } else if (kitDay === 'events') {
      // Check eligibility for events kit
      if (!kitRecord.canReceiveEventsKit()) {
        return res.status(403).json({
          success: false,
          error: 'NOT_ELIGIBLE_EVENTS',
          message: `❌ Not eligible for events day kit.\n\nYou are registered as: ${user.registrationType.toUpperCase()}\n\nOnly GENERAL or BOTH registrations can receive events day kit.`
        });
      }
      
      // Check if already issued
      if (kitRecord.eventsDayKit.issued) {
        return res.status(200).json({
          success: true,
          alreadyIssued: true,
          message: '⚠️ Events day kit already issued to this participant',
          kit: {
            idCardNumber: kitRecord.eventsDayKit.idCardNumber,
            issuedAt: kitRecord.eventsDayKit.issuedAt,
            contents: kitRecord.eventsDayKit.contents
          }
        });
      }
      
      // Issue events day kit
      const eventsContents = KitDistribution.getEventsDayKitContents();
      kitRecord.eventsDayKit = {
        issued: true,
        issuedAt: new Date(),
        issuedBy: req.user.id,
        contents: eventsContents,
        issuanceMethod: 'qr-scan',
        collectionPoint: collectionPoint || 'main-desk',
        participantSignature: signature,
        deviceInfo
      };
      
      await kitRecord.save();
      
      // Populate details
      await kitRecord.populate([
        { path: 'user', select: 'participantId name email phone college' },
        { path: 'eventsDayKit.issuedBy', select: 'name email' }
      ]);
      
      return res.status(201).json({
        success: true,
        message: '✅ Events day kit issued successfully',
        kit: {
          id: kitRecord._id,
          kitDay: 'events',
          idCardNumber: kitRecord.eventsDayKit.idCardNumber,
          participant: {
            id: user.participantId,
            name: user.name,
            college: user.college,
            registrationType: user.registrationType
          },
          contents: kitRecord.eventsDayKit.contents,
          issuedAt: kitRecord.eventsDayKit.issuedAt,
          issuedBy: kitRecord.eventsDayKit.issuedBy
        }
      });
    }
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
 * @route   POST /api/v1/qr-scan/scan-and-checkin
 * @access  Private (Coordinator/Admin)
 */
exports.scanAndCheckIn = async (req, res) => {
  try {
    const { 
      qrData, 
      eventId, 
      eventType = 'event',
      issueKit = false,
      kitDay = null, // 'workshop' or 'events'
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
    
    // Step 3: Issue kit (if requested and kitDay specified)
    if (issueKit && kitDay) {
      let kitRecord = await KitDistribution.findOne({ participantId: validation.participant.id });
      
      if (!kitRecord) {
        kitRecord = new KitDistribution({
          participantId: validation.participant.id,
          user: user._id,
          registrationType: user.registrationType
        });
      }
      
      if (kitDay === 'workshop') {
        if (kitRecord.canReceiveWorkshopKit() && !kitRecord.workshopDayKit.issued) {
          const workshopContents = KitDistribution.getWorkshopDayKitContents();
          kitRecord.workshopDayKit = {
            issued: true,
            issuedAt: new Date(),
            issuedBy: req.user.id,
            contents: workshopContents,
            issuanceMethod: 'qr-scan',
            collectionPoint: collectionPoint || 'workshop-desk',
            participantSignature: signature,
            deviceInfo
          };
          
          await kitRecord.save();
          
          result.kit = {
            status: 'issued',
            kitDay: 'workshop',
            idCardNumber: kitRecord.workshopDayKit.idCardNumber,
            contents: kitRecord.workshopDayKit.contents,
            message: '✅ Workshop day kit issued successfully'
          };
        } else if (kitRecord.workshopDayKit.issued) {
          result.kit = {
            status: 'already_issued',
            kitDay: 'workshop',
            idCardNumber: kitRecord.workshopDayKit.idCardNumber,
            issuedAt: kitRecord.workshopDayKit.issuedAt,
            message: '⚠️ Workshop day kit already issued'
          };
        } else {
          result.kit = {
            status: 'not_eligible',
            kitDay: 'workshop',
            message: '❌ Not eligible for workshop day kit'
          };
        }
      } else if (kitDay === 'events') {
        if (kitRecord.canReceiveEventsKit() && !kitRecord.eventsDayKit.issued) {
          const eventsContents = KitDistribution.getEventsDayKitContents();
          kitRecord.eventsDayKit = {
            issued: true,
            issuedAt: new Date(),
            issuedBy: req.user.id,
            contents: eventsContents,
            issuanceMethod: 'qr-scan',
            collectionPoint: collectionPoint || 'main-desk',
            participantSignature: signature,
            deviceInfo
          };
          
          await kitRecord.save();
          
          result.kit = {
            status: 'issued',
            kitDay: 'events',
            idCardNumber: kitRecord.eventsDayKit.idCardNumber,
            contents: kitRecord.eventsDayKit.contents,
            message: '✅ Events day kit issued successfully'
          };
        } else if (kitRecord.eventsDayKit.issued) {
          result.kit = {
            status: 'already_issued',
            kitDay: 'events',
            idCardNumber: kitRecord.eventsDayKit.idCardNumber,
            issuedAt: kitRecord.eventsDayKit.issuedAt,
            message: '⚠️ Events day kit already issued'
          };
        } else {
          result.kit = {
            status: 'not_eligible',
            kitDay: 'events',
            message: '❌ Not eligible for events day kit'
          };
        }
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
 * @route   GET /api/v1/qr-scan/kit-status/:participantId
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
    
    const kitRecord = await KitDistribution.getKitDetails(participantId);
    
    if (!kitRecord) {
      return res.status(200).json({
        success: true,
        participant: {
          id: user.participantId,
          name: user.name,
          registrationType: user.registrationType
        },
        workshopKit: {
          eligible: ['workshop', 'both'].includes(user.registrationType),
          issued: false,
          message: 'Workshop day kit not yet issued'
        },
        eventsKit: {
          eligible: ['general', 'both'].includes(user.registrationType),
          issued: false,
          message: 'Events day kit not yet issued'
        },
        totalKitsIssued: 0
      });
    }
    
    const status = kitRecord.getKitStatus();
    
    res.status(200).json({
      success: true,
      participant: {
        id: user.participantId,
        name: user.name,
        email: user.email,
        registrationType: user.registrationType
      },
      workshopKit: {
        eligible: status.workshopKit.eligible,
        issued: status.workshopKit.issued,
        idCardNumber: status.workshopKit.idCardNumber,
        issuedAt: kitRecord.workshopDayKit.issuedAt,
        issuedBy: kitRecord.workshopDayKit.issuedBy,
        contents: kitRecord.workshopDayKit.contents,
        collectionPoint: kitRecord.workshopDayKit.collectionPoint,
        message: status.workshopKit.issued ? '✅ Workshop day kit issued' : 'Workshop day kit not yet issued'
      },
      eventsKit: {
        eligible: status.eventsKit.eligible,
        issued: status.eventsKit.issued,
        idCardNumber: status.eventsKit.idCardNumber,
        issuedAt: kitRecord.eventsDayKit.issuedAt,
        issuedBy: kitRecord.eventsDayKit.issuedBy,
        contents: kitRecord.eventsDayKit.contents,
        collectionPoint: kitRecord.eventsDayKit.collectionPoint,
        message: status.eventsKit.issued ? '✅ Events day kit issued' : 'Events day kit not yet issued'
      },
      totalKitsIssued: status.totalKitsIssued
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

