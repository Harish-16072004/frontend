const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
  registrationNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    default: null
  },
  workshop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workshop',
    default: null
  },
  type: {
    type: String,
    enum: ['event', 'workshop'],
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
    college: String,
    rollNumber: String
  }],
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed',],
    default: 'pending'
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    default: null
  },
  // Payment Screenshot Upload (NEW)
  paymentScreenshot: {
    type: String,
    default: null  // S3 URL of uploaded payment proof
  },
  transactionId: {
    type: String,
    default: null,
    trim: true
  },
  // Payment Verification (NEW)
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
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
  rejectionReason: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'attended'],
    default: 'pending'
  },
  // QR Code (Generated after payment approval)
  qrCode: {
    type: String,
    default: null  // S3 URL of generated QR code
  },
  qrCodeData: {
    type: String,
    default: null  // Encoded data in QR code
  },
  checkInTime: {
    type: Date,
    default: null
  },
  checkInBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  notes: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Generate registration number before saving
RegistrationSchema.pre('save', async function(next) {
  if (!this.isNew) {
    return next();
  }

  try {
    const prefix = this.type === 'event' ? 'SHACK' : 'WORK';
    const year = new Date().getFullYear();
    
    // Get count of existing registrations
    const count = await mongoose.model('Registration').countDocuments();
    const paddedCount = String(count + 1).padStart(5, '0');
    
    this.registrationNumber = `${prefix}${year}${paddedCount}`;
    next();
  } catch (error) {
    next(error);
  }
});

// Mark as attended
RegistrationSchema.methods.markAttended = async function(checkedInBy) {
  this.status = 'attended';
  this.checkInTime = new Date();
  this.checkInBy = checkedInBy;
  await this.save();
};

// Indexes
RegistrationSchema.index({ user: 1, event: 1 });
RegistrationSchema.index({ user: 1, workshop: 1 });
// registrationNumber index is automatically created by unique: true
RegistrationSchema.index({ paymentStatus: 1, status: 1 });

module.exports = mongoose.model('Registration', RegistrationSchema);
