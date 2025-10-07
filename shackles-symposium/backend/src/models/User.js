const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number'],
    match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  college: {
    type: String,
    required: [true, 'Please provide college name'],
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Please provide department'],
    trim: true
  },
  year: {
    type: String,
    required: [true, 'Please provide year'],
    enum: ['1', '2', '3', '4']
  },
  collegeLocation: {
    type: String,
    trim: true
  },
  rollNumber: {
    type: String,
    trim: true
  },
  registrationType: {
    type: String,
    enum: ['general', 'workshop', 'both'],
    default: null
  },
  paymentAmount: {
    type: Number,
    default: 0
  },
  transactionId: {
    type: String,
    trim: true
  },
  paymentScreenshot: {
    type: String,
    default: null
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  verificationNotes: {
    type: String,
    default: null
  },
  verifiedAt: {
    type: Date,
    default: null
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  rejectionReason: {
    type: String,
    default: null
  },
  rejectedAt: {
    type: Date,
    default: null
  },
  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  termsAccepted: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'coordinator'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  profilePicture: {
    type: String,
    default: null
  },
  registrations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Registration'
  }],
  payments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  }],
  participantId: {
    type: String,
    sparse: true, // Allows multiple documents without this field, enforces uniqueness when present
    index: { unique: true, sparse: true }
    // No default value - field won't exist until payment verification
  },
  qrCode: {
    type: String
    // No default value - field added only on verification
  },
  qrCodeKey: {
    type: String
    // No default value - field added only on verification
  },
  // Dynamic QR Code Security Token
  qrToken: {
    type: String,
    unique: true,
    sparse: true,
    index: true
  },
  qrTokenExpiry: {
    type: Date
  },
  qrTokenVersion: {
    type: Number,
    default: 1
  },
  lastQRScan: {
    type: Date
  },
  qrScanCount: {
    type: Number,
    default: 0
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  verificationToken: String,
  verificationTokenExpire: Date
}, {
  timestamps: true
});

// Encrypt password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Match password
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password reset token
UserSchema.methods.getResetPasswordToken = function() {
  const resetToken = crypto.randomBytes(20).toString('hex');
  
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  return resetToken;
};

// Generate email verification token
UserSchema.methods.getVerificationToken = function() {
  const verificationToken = crypto.randomBytes(20).toString('hex');
  
  this.verificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  
  this.verificationTokenExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  
  return verificationToken;
};

// Generate secure dynamic QR token
UserSchema.methods.generateQRToken = function(expiryDays = 30) {
  // Generate cryptographically secure random token
  const token = crypto.randomBytes(32).toString('hex');
  
  // Hash the token before storing (security best practice)
  this.qrToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  
  // Set expiry (default 30 days from now)
  this.qrTokenExpiry = Date.now() + expiryDays * 24 * 60 * 60 * 1000;
  
  // Increment version (for token revocation tracking)
  this.qrTokenVersion = (this.qrTokenVersion || 0) + 1;
  
  // Return the unhashed token (this goes in QR code)
  return token;
};

// Validate QR token
UserSchema.methods.validateQRToken = function(token) {
  // Hash the provided token
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  
  // Check if token matches and hasn't expired
  if (this.qrToken !== hashedToken) {
    return { valid: false, reason: 'INVALID_TOKEN' };
  }
  
  if (this.qrTokenExpiry && Date.now() > this.qrTokenExpiry) {
    return { valid: false, reason: 'TOKEN_EXPIRED' };
  }
  
  return { valid: true };
};

// Revoke QR token (for security - if QR is compromised)
UserSchema.methods.revokeQRToken = function() {
  this.qrToken = null;
  this.qrTokenExpiry = null;
  this.qrTokenVersion = (this.qrTokenVersion || 0) + 1;
};

module.exports = mongoose.model('User', UserSchema);
