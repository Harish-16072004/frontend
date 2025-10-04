const crypto = require('crypto');
const Payment = require('../models/Payment');
const Registration = require('../models/Registration');
const { sendEmail } = require('../utils/emailService');

// @desc    Create payment order
// @route   POST /api/v1/payments/create-order
// @access  Private
exports.createPaymentOrder = async (req, res) => {
  try {
    const { registrationId, amount, paymentMethod = 'upi' } = req.body;

    const registration = await Registration.findById(registrationId)
      .populate('event workshop');

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    // Check if user owns this registration
    if (registration.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Calculate amount
    const finalAmount = amount || (() => {
      let calculatedAmount = 0;
      if (registration.event) {
        calculatedAmount += registration.event.fees;
      }
      if (registration.workshop) {
        calculatedAmount += registration.workshop.fees;
      }
      if (registration.accommodationRequired) {
        calculatedAmount += 500; // Accommodation fee
      }
      return calculatedAmount;
    })();

    // Create payment record
    const payment = await Payment.create({
      user: req.user.id,
      registration: registrationId,
      amount: finalAmount,
      currency: 'INR',
      paymentMethod,
      transactionId: `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      status: 'pending'
    });

    res.status(200).json({
      success: true,
      message: 'Payment order created. Complete payment using provided details.',
      data: {
        paymentId: payment._id,
        amount: finalAmount,
        currency: 'INR',
        paymentMethod,
        transactionId: payment.transactionId,
        payment: payment
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Verify payment
// @route   POST /api/v1/payments/verify
// @access  Private
exports.verifyPayment = async (req, res) => {
  try {
    const { paymentId, transactionId, status: paymentStatus } = req.body;

    // Find payment
    const payment = await Payment.findById(paymentId)
      .populate({
        path: 'registration',
        populate: {
          path: 'user event workshop'
        }
      });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Verify user owns this payment
    if (payment.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Update payment with transaction details
    payment.transactionId = transactionId || payment.transactionId;
    payment.status = paymentStatus || 'success';
    payment.paymentDate = Date.now();
    await payment.save();

    // Update registration status
    const registration = await Registration.findById(payment.registration._id);
    registration.paymentStatus = 'paid';
    registration.status = 'confirmed';
    registration.payment = payment._id;
    await registration.save();

    // Send confirmation email
    try {
      await sendEmail({
        to: payment.registration.user.email,
        subject: 'Payment Successful - SHACKLES 2025',
        template: 'paymentSuccess',
        context: {
          name: payment.registration.user.name,
          registrationNumber: registration.registrationNumber,
          amount: payment.amount,
          eventName: registration.event?.name || registration.workshop?.title
        }
      });
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        payment,
        registration
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all payments (Admin)
// @route   GET /api/v1/payments
// @access  Private/Admin
exports.getPayments = async (req, res) => {
  try {
    const { status } = req.query;
    
    const filter = {};
    if (status) filter.status = status;

    const payments = await Payment.find(filter)
      .populate('user', 'name email phone')
      .populate({
        path: 'registration',
        populate: { path: 'event workshop' }
      })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single payment
// @route   GET /api/v1/payments/:id
// @access  Private
exports.getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate({
        path: 'registration',
        populate: { path: 'event workshop' }
      });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Check if user owns this payment or is admin
    if (payment.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update payment status (Admin)
// @route   PUT /api/v1/payments/:id/status
// @access  Private/Admin
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment status updated',
      data: payment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Refund payment
// @route   POST /api/v1/payments/:id/refund
// @access  Private/Admin
exports.refundPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    if (payment.status !== 'success') {
      return res.status(400).json({
        success: false,
        message: 'Only successful payments can be refunded'
      });
    }

    // Process refund via Razorpay
    const refund = await razorpay.payments.refund(payment.razorpayPaymentId, {
      amount: payment.amount * 100 // In paise
    });

    payment.status = 'refunded';
    payment.refundId = refund.id;
    await payment.save();

    res.status(200).json({
      success: true,
      message: 'Refund processed successfully',
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
