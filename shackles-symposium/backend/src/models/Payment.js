const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  registration: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Registration',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Please provide amount'],
    min: [0, 'Amount cannot be negative']
  },
  currency: {
    type: String,
    default: 'INR',
    uppercase: true
  },
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'upi', 'card', 'netbanking', 'wallet', 'cash', 'other'],
    default: 'razorpay'
  },
  razorpayOrderId: {
    type: String,
    sparse: true
  },
  razorpayPaymentId: {
    type: String,
    sparse: true
  },
  razorpaySignature: {
    type: String
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'success', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentDate: {
    type: Date,
    default: null
  },
  refundAmount: {
    type: Number,
    default: 0
  },
  refundDate: {
    type: Date,
    default: null
  },
  refundReason: {
    type: String
  },
  refundTransactionId: {
    type: String
  },
  failureReason: {
    type: String
  },
  receiptUrl: {
    type: String
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  verifiedAt: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
    maxlength: 500
  },
  metadata: {
    type: Map,
    of: String
  }
}, {
  timestamps: true
});

// Generate transaction ID before saving
PaymentSchema.pre('save', async function(next) {
  if (!this.isNew || this.transactionId) {
    return next();
  }

  try {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.transactionId = `TXN${timestamp}${random}`;
    next();
  } catch (error) {
    next(error);
  }
});

// Mark payment as success
PaymentSchema.methods.markSuccess = async function(paymentDetails = {}) {
  this.status = 'success';
  this.paymentDate = new Date();
  
  if (paymentDetails.razorpayPaymentId) {
    this.razorpayPaymentId = paymentDetails.razorpayPaymentId;
  }
  if (paymentDetails.razorpaySignature) {
    this.razorpaySignature = paymentDetails.razorpaySignature;
  }
  
  await this.save();
};

// Mark payment as failed
PaymentSchema.methods.markFailed = async function(reason) {
  this.status = 'failed';
  this.failureReason = reason;
  await this.save();
};

// Process refund
PaymentSchema.methods.processRefund = async function(amount, reason) {
  if (this.status !== 'success') {
    throw new Error('Can only refund successful payments');
  }
  
  if (amount > this.amount - this.refundAmount) {
    throw new Error('Refund amount exceeds available balance');
  }
  
  this.refundAmount += amount;
  this.refundDate = new Date();
  this.refundReason = reason;
  
  if (this.refundAmount === this.amount) {
    this.status = 'refunded';
  }
  
  await this.save();
};

// Verify payment
PaymentSchema.methods.verify = async function(verifiedBy) {
  this.verifiedBy = verifiedBy;
  this.verifiedAt = new Date();
  await this.save();
};

// Indexes
PaymentSchema.index({ user: 1, status: 1 });
PaymentSchema.index({ registration: 1 });
PaymentSchema.index({ transactionId: 1 });
PaymentSchema.index({ razorpayOrderId: 1 });
PaymentSchema.index({ razorpayPaymentId: 1 });
PaymentSchema.index({ paymentDate: -1 });

module.exports = mongoose.model('Payment', PaymentSchema);
