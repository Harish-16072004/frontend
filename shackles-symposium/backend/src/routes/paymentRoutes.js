const express = require('express');
const router = express.Router();
const {
  createPaymentOrder,
  verifyPayment,
  getPayments,
  getPayment,
  updatePaymentStatus,
  refundPayment,
  razorpayWebhook
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

// Webhook route (no auth required - Razorpay calls this)
router.post('/razorpay/webhook', razorpayWebhook);

// Protected routes
router.use(protect);

router.post('/create-order', createPaymentOrder);
router.post('/verify', verifyPayment);

router.get('/', authorize('admin'), getPayments);
router.get('/:id', getPayment);

// Admin only routes
router.put('/:id/status', authorize('admin'), updatePaymentStatus);
router.post('/:id/refund', authorize('admin'), refundPayment);

module.exports = router;
