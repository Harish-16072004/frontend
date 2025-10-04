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
  getAnalytics
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

// Payment management
router.get('/payments', getAllPayments);
router.post('/payments/:id/verify', verifyPaymentManually);

// Data export
router.post('/export/excel', exportDataToExcel);
router.post('/export/google-sheets', exportDataToGoogleSheets);

// Communications
router.post('/send-bulk-email', sendBulkEmail);

module.exports = router;
