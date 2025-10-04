const mongoose = require('mongoose');

const WorkshopSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide workshop title'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Please provide workshop description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  instructor: {
    name: {
      type: String,
      required: [true, 'Please provide instructor name']
    },
    designation: String,
    organization: String,
    bio: String,
    photo: String
  },
  duration: {
    hours: {
      type: Number,
      required: [true, 'Please provide duration in hours']
    }
  },
  schedule: [{
    date: {
      type: Date,
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    topic: String
  }],
  venue: {
    type: String,
    required: [true, 'Please provide venue'],
    trim: true
  },
  image: {
    type: String,
    default: null
  },
  registrationFee: {
    type: Number,
    required: [true, 'Please provide registration fee'],
    min: [0, 'Fee cannot be negative']
  },
  maxParticipants: {
    type: Number,
    required: [true, 'Please provide maximum participants']
  },
  currentParticipants: {
    type: Number,
    default: 0
  },
  prerequisites: [{
    type: String
  }],
  learningOutcomes: [{
    type: String
  }],
  materials: [{
    name: String,
    url: String,
    type: String
  }],
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
  certificate: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    lowercase: true
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for registrations
WorkshopSchema.virtual('registrations', {
  ref: 'Registration',
  localField: '_id',
  foreignField: 'workshop',
  justOne: false
});

// Check if workshop is full
WorkshopSchema.methods.isFull = function() {
  return this.currentParticipants >= this.maxParticipants;
};

// Check if registration is open
WorkshopSchema.methods.isRegistrationOpen = function() {
  const now = new Date();
  return now < this.registrationDeadline && this.status === 'upcoming' && this.isActive;
};

// Increment participant count
WorkshopSchema.methods.incrementParticipants = async function(count = 1) {
  this.currentParticipants += count;
  await this.save();
};

// Decrement participant count
WorkshopSchema.methods.decrementParticipants = async function(count = 1) {
  this.currentParticipants = Math.max(0, this.currentParticipants - count);
  await this.save();
};

// Index for faster queries
WorkshopSchema.index({ status: 1, isActive: 1 });
WorkshopSchema.index({ 'schedule.date': 1 });
WorkshopSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Workshop', WorkshopSchema);
