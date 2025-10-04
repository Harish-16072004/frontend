const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
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
  checkInTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  checkOutTime: {
    type: Date,
    default: null
  },
  checkInMethod: {
    type: String,
    enum: ['qr', 'manual', 'registration'],
    default: 'qr'
  },
  checkInBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  checkOutBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  location: {
    latitude: Number,
    longitude: Number
  },
  deviceInfo: {
    userAgent: String,
    ipAddress: String
  },
  notes: {
    type: String,
    maxlength: 500
  },
  certificateIssued: {
    type: Boolean,
    default: false
  },
  certificateIssuedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Calculate duration
AttendanceSchema.virtual('duration').get(function() {
  if (!this.checkOutTime) return null;
  return Math.round((this.checkOutTime - this.checkInTime) / (1000 * 60)); // in minutes
});

// Check out
AttendanceSchema.methods.checkOut = async function(checkOutBy) {
  this.checkOutTime = new Date();
  this.checkOutBy = checkOutBy;
  await this.save();
};

// Issue certificate
AttendanceSchema.methods.issueCertificate = async function() {
  this.certificateIssued = true;
  this.certificateIssuedAt = new Date();
  await this.save();
};

// Indexes
AttendanceSchema.index({ user: 1, event: 1 });
AttendanceSchema.index({ user: 1, workshop: 1 });
AttendanceSchema.index({ registration: 1 });
AttendanceSchema.index({ checkInTime: -1 });

module.exports = mongoose.model('Attendance', AttendanceSchema);
