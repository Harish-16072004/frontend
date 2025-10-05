const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  getAllRegistrations,
  getAllPayments,
  verifyPaymentManually,
  exportDataToExcel,
  exportDataToGoogleSheets,
  sendBulkEmail,
  getAnalytics,
  getPendingVerifications,
  getPendingPayments,
  verifyPayment,
  rejectPayment,
  getVerifiedPayments,
  getPaymentStats,
  getParticipantById,
  regenerateQRCode,
  getKitStats,
  sendBulkEmails,
  getEventStats,
  generateUserParticipantId
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All routes require admin authorization
router.use(protect);
router.use(authorize('admin'));

// Dashboard
router.get('/dashboard', getDashboardStats);
router.get('/analytics', getAnalytics);

// User management
router.get('/users', getAllUsers);

// Registration management
router.get('/registrations', getAllRegistrations);

// Payment Verification (NEW - Direct Registration Model)
router.get('/payments/pending', getPendingPayments);
router.get('/payments/verified', getVerifiedPayments);
router.get('/payments/stats', getPaymentStats);
router.put('/payments/:userId/verify', verifyPayment);
router.put('/payments/:userId/reject', rejectPayment);

// Payment Verification (OLD - Event Registration Model)
router.get('/registrations/pending-verification', getPendingVerifications);
router.put('/registrations/:id/verify', verifyPaymentManually);

// Payment management
router.get('/payments', getAllPayments);
router.post('/payments/:id/verify', verifyPaymentManually);

// Data export
router.post('/export/excel', exportDataToExcel);
router.post('/export/google-sheets', exportDataToGoogleSheets);

// Communications
router.post('/send-bulk-email', sendBulkEmail);
router.post('/bulk-email', sendBulkEmails);

// Participant management (NEW)
router.get('/participant/:participantId', getParticipantById);
router.post('/participant/:participantId/regenerate-qr', regenerateQRCode);

// Kit distribution stats
router.get('/kit-stats', getKitStats);

// Event statistics
router.get('/event-stats', getEventStats);

// Generate participant ID
router.post('/generate-participant-id/:userId', generateUserParticipantId);

module.exports = router;
