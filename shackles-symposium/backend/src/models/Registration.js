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
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'attended'],
    default: 'pending'
  },
  qrCode: {
    type: String,
    default: null
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
  },
  cancelledAt: Date,
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancellationReason: String
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

// Check if registration can be cancelled
RegistrationSchema.methods.canCancel = function() {
  if (this.status === 'cancelled' || this.status === 'attended') {
    return false;
  }
  
  // Can't cancel if checked in
  if (this.checkInTime) {
    return false;
  }
  
  // Can't cancel if less than 24 hours before event
  let eventDate;
  if (this.event && this.event.date) {
    eventDate = this.event.date;
  } else if (this.workshop && this.workshop.schedule && this.workshop.schedule[0]) {
    eventDate = this.workshop.schedule[0].date;
  }
  
  if (eventDate) {
    const hoursUntilEvent = (eventDate - new Date()) / (1000 * 60 * 60);
    if (hoursUntilEvent < 24) {
      return false;
    }
  }
  
  return true;
};

// Mark as attended
RegistrationSchema.methods.markAttended = async function(checkedInBy) {
  this.status = 'attended';
  this.checkInTime = new Date();
  this.checkInBy = checkedInBy;
  await this.save();
};

// Cancel registration
RegistrationSchema.methods.cancel = async function(cancelledBy, reason) {
  if (!this.canCancel()) {
    throw new Error('Registration cannot be cancelled');
  }
  
  this.status = 'cancelled';
  this.cancelledAt = new Date();
  this.cancelledBy = cancelledBy;
  this.cancellationReason = reason;
  await this.save();
};

// Indexes
RegistrationSchema.index({ user: 1, event: 1 });
RegistrationSchema.index({ user: 1, workshop: 1 });
RegistrationSchema.index({ registrationNumber: 1 });
RegistrationSchema.index({ paymentStatus: 1, status: 1 });

module.exports = mongoose.model('Registration', RegistrationSchema);
