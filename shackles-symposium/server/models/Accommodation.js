const mongoose = require('mongoose');

const accommodationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requestNumber: {
    type: String,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Please provide name']
  },
  email: {
    type: String,
    required: [true, 'Please provide email']
  },
  phone: {
    type: String,
    required: [true, 'Please provide phone number']
  },
  college: {
    type: String,
    required: [true, 'Please provide college name']
  },
  gender: {
    type: String,
    required: [true, 'Please specify gender'],
    enum: ['male', 'female', 'other']
  },
  checkInDate: {
    type: Date,
    required: [true, 'Please provide check-in date']
  },
  checkOutDate: {
    type: Date,
    required: [true, 'Please provide check-out date']
  },
  numberOfDays: {
    type: Number,
    required: true
  },
  roomType: {
    type: String,
    enum: ['shared', 'individual'],
    default: 'shared'
  },
  specialRequirements: String,
  accommodationFee: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentId: String,
  paymentDetails: {
    amount: Number,
    method: String,
    transactionId: String,
    paidAt: Date
  },
  status: {
    type: String,
    enum: ['requested', 'confirmed', 'cancelled'],
    default: 'requested'
  },
  roomNumber: String
}, {
  timestamps: true
});

// Generate request number before saving
accommodationSchema.pre('save', async function(next) {
  if (!this.requestNumber) {
    const count = await mongoose.model('Accommodation').countDocuments();
    this.requestNumber = `ACC${new Date().getFullYear()}${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

// Indexes
accommodationSchema.index({ userId: 1 });
accommodationSchema.index({ requestNumber: 1 }, { unique: true });
accommodationSchema.index({ paymentStatus: 1 });

module.exports = mongoose.model('Accommodation', accommodationSchema);
