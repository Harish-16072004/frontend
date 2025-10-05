const mongoose = require('mongoose');

const eventRegistrationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true
    },
    eventName: {
      type: String,
      required: true
    },
    eventType: {
      type: String,
      enum: ['technical', 'non-technical', 'workshop', 'special'],
      required: true
    },
    registeredAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['registered', 'cancelled', 'attended'],
      default: 'registered'
    },
    teamMembers: [{
      name: String,
      email: String,
      phone: String,
      college: String
    }],
    isTeamEvent: {
      type: Boolean,
      default: false
    },
    paymentRequired: {
      type: Boolean,
      default: false
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'not-required'],
      default: 'not-required'
    }
  },
  {
    timestamps: true
  }
);

// Compound index to prevent duplicate registrations
eventRegistrationSchema.index({ user: 1, event: 1 }, { unique: true });

// Index for efficient queries
eventRegistrationSchema.index({ event: 1, status: 1 });
eventRegistrationSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model('EventRegistration', eventRegistrationSchema);
