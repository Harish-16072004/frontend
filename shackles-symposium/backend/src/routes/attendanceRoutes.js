const express = require('express');
const router = express.Router();
const {
  markAttendance,
  getAttendance,
  verifyQRCode,
  getEventAttendance,
  exportAttendance
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

// Protected routes
router.use(protect);

// Mark attendance (admin or volunteer)
router.post('/mark', authorize('admin', 'volunteer'), markAttendance);

// Verify QR code
router.post('/verify-qr', authorize('admin', 'volunteer'), verifyQRCode);

// Get attendance records
router.get('/:eventId', authorize('admin'), getEventAttendance);
router.get('/user/:userId', getAttendance);

// Export attendance
router.post('/export/:eventId', authorize('admin'), exportAttendance);

module.exports = router;
