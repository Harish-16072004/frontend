/**
 * QR Scan Routes
 * Routes for QR code scanning, attendance, and kit distribution
 */

const express = require('express');
const router = express.Router();
const {
  scanQRCode,
  checkInParticipant,
  issueKit,
  scanAndCheckIn,
  getKitStatus,
  getAttendanceHistory
} = require('../controllers/qrScanController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// QR Scanning and Validation
router.post('/scan-qr', authorize('admin', 'coordinator'), scanQRCode);

// Check-in after QR validation
router.post('/check-in', authorize('admin', 'coordinator'), checkInParticipant);

// Kit distribution
router.post('/issue-kit', authorize('admin', 'coordinator'), issueKit);

// Combined: Scan + Check-in (+ optional Kit)
router.post('/scan-and-checkin', authorize('admin', 'coordinator'), scanAndCheckIn);

// Get kit distribution status
router.get('/kit-status/:participantId', authorize('admin', 'coordinator'), getKitStatus);

// Get attendance history
router.get('/history/:participantId', authorize('admin', 'coordinator'), getAttendanceHistory);

module.exports = router;
