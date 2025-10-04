const Attendance = require('../models/Attendance');
const Registration = require('../models/Registration');
const exportToExcel = require('../utils/excelGenerator');

// @desc    Mark attendance
// @route   POST /api/v1/attendance/mark
// @access  Private/Admin/Volunteer
exports.markAttendance = async (req, res) => {
  try {
    const { registrationId, eventId } = req.body;

    // Check if registration exists
    const registration = await Registration.findById(registrationId)
      .populate('user', 'name email')
      .populate('event', 'name');

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    // Check if already marked
    const existingAttendance = await Attendance.findOne({
      registration: registrationId,
      event: eventId
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: 'Attendance already marked'
      });
    }

    // Create attendance record
    const attendance = await Attendance.create({
      user: registration.user._id,
      registration: registrationId,
      event: eventId,
      markedBy: req.user.id,
      timestamp: Date.now()
    });

    res.status(201).json({
      success: true,
      message: 'Attendance marked successfully',
      data: attendance
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Verify QR code and mark attendance
// @route   POST /api/v1/attendance/verify-qr
// @access  Private/Admin/Volunteer
exports.verifyQRCode = async (req, res) => {
  try {
    const { qrData, eventId } = req.body;

    // Decode QR and get registration ID
    const registrationId = qrData; // Assuming QR contains registration ID

    const registration = await Registration.findById(registrationId)
      .populate('user', 'name email phone college')
      .populate('event', 'name category');

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Invalid QR code - Registration not found'
      });
    }

    // Check if registration is confirmed
    if (registration.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        message: 'Registration not confirmed. Payment pending.'
      });
    }

    // Check if already attended
    const existingAttendance = await Attendance.findOne({
      registration: registrationId,
      event: eventId
    });

    if (existingAttendance) {
      return res.status(200).json({
        success: true,
        message: 'Already checked in',
        data: {
          registration,
          attendance: existingAttendance,
          alreadyCheckedIn: true
        }
      });
    }

    // Mark attendance
    const attendance = await Attendance.create({
      user: registration.user._id,
      registration: registrationId,
      event: eventId,
      markedBy: req.user.id,
      timestamp: Date.now()
    });

    res.status(201).json({
      success: true,
      message: 'Check-in successful!',
      data: {
        registration,
        attendance,
        alreadyCheckedIn: false
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's attendance
// @route   GET /api/v1/attendance/user/:userId
// @access  Private
exports.getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ user: req.params.userId })
      .populate('event', 'name date')
      .populate('registration')
      .sort('-timestamp');

    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get event attendance
// @route   GET /api/v1/attendance/:eventId
// @access  Private/Admin
exports.getEventAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ event: req.params.eventId })
      .populate('user', 'name email phone college')
      .populate('registration', 'registrationNumber')
      .populate('markedBy', 'name')
      .sort('-timestamp');

    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Export attendance
// @route   POST /api/v1/attendance/export/:eventId
// @access  Private/Admin
exports.exportAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ event: req.params.eventId })
      .populate('user', 'name email phone college department year')
      .populate('registration', 'registrationNumber')
      .populate('event', 'name date')
      .lean();

    if (attendance.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No attendance records found'
      });
    }

    // Format data for Excel
    const formattedData = attendance.map(record => ({
      'Registration Number': record.registration?.registrationNumber,
      'Name': record.user?.name,
      'Email': record.user?.email,
      'Phone': record.user?.phone,
      'College': record.user?.college,
      'Department': record.user?.department,
      'Year': record.user?.year,
      'Event': record.event?.name,
      'Checked In At': new Date(record.timestamp).toLocaleString()
    }));

    const buffer = await exportToExcel(formattedData, 'attendance');

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=attendance-${req.params.eventId}-${Date.now()}.xlsx`);
    res.send(buffer);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
