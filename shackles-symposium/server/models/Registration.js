const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  teamName: {
    type: String,
    trim: true
  },
  teamMembers: [{
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    college: {
      type: String,
      required: true
    },
    department: String,
    year: Number
  }],
  registrationNumber: {
    type: String,
    unique: true
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
    enum: ['registered', 'confirmed', 'cancelled', 'waitlist'],
    default: 'registered'
  },
  qrCode: String,
  checkInStatus: {
    type: Boolean,
    default: false
  },
  checkInTime: Date
}, {
  timestamps: true
});

// Generate registration number before saving
registrationSchema.pre('save', async function(next) {
  if (!this.registrationNumber) {
    const count = await mongoose.model('Registration').countDocuments();
    this.registrationNumber = `SHACK${new Date().getFullYear()}${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

// Indexes
registrationSchema.index({ userId: 1, eventId: 1 }, { unique: true });
registrationSchema.index({ registrationNumber: 1 }, { unique: true });
registrationSchema.index({ paymentStatus: 1 });

module.exports = mongoose.model('Registration', registrationSchema);
