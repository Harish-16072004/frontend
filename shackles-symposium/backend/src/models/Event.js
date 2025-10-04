const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide event name'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Please provide event description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Please specify event category'],
    enum: ['technical', 'non-technical', 'special'],
    lowercase: true
  },
  type: {
    type: String,
    enum: ['individual', 'team'],
    default: 'individual'
  },
  teamSize: {
    min: Number,
    max: Number
  },
  image: {
    type: String,
    default: null
  },
  venue: {
    type: String,
    required: [true, 'Please provide venue'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Please provide event date']
  },
  time: {
    start: {
      type: String,
      required: [true, 'Please provide start time']
    },
    end: {
      type: String,
      required: [true, 'Please provide end time']
    }
  },
  registrationFee: {
    type: Number,
    default: 0,
    min: [0, 'Fee cannot be negative']
  },
  maxParticipants: {
    type: Number,
    default: null
  },
  currentParticipants: {
    type: Number,
    default: 0
  },
  coordinators: [{
    name: String,
    phone: String,
    email: String
  }],
  rules: [{
    type: String
  }],
  prizes: {
    first: String,
    second: String,
    third: String
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  registrationDeadline: {
    type: Date,
    required: [true, 'Please provide registration deadline']
  },
  tags: [{
    type: String,
    lowercase: true
  }],
  attachments: [{
    name: String,
    url: String,
    type: String
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for registrations
EventSchema.virtual('registrations', {
  ref: 'Registration',
  localField: '_id',
  foreignField: 'event',
  justOne: false
});

// Check if event is full
EventSchema.methods.isFull = function() {
  if (!this.maxParticipants) return false;
  return this.currentParticipants >= this.maxParticipants;
};

// Check if registration is open
EventSchema.methods.isRegistrationOpen = function() {
  const now = new Date();
  return now < this.registrationDeadline && this.status === 'upcoming' && this.isActive;
};

// Increment participant count
EventSchema.methods.incrementParticipants = async function(count = 1) {
  this.currentParticipants += count;
  await this.save();
};

// Decrement participant count
EventSchema.methods.decrementParticipants = async function(count = 1) {
  this.currentParticipants = Math.max(0, this.currentParticipants - count);
  await this.save();
};

// Index for faster queries
EventSchema.index({ category: 1, status: 1, isActive: 1 });
EventSchema.index({ date: 1 });
EventSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Event', EventSchema);
