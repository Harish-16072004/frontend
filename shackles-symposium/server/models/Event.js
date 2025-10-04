const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide event title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide event description']
  },
  category: {
    type: String,
    required: [true, 'Please provide event category'],
    enum: ['technical', 'non-technical', 'special', 'workshop']
  },
  type: {
    type: String,
    required: [true, 'Please specify if event is individual or team'],
    enum: ['individual', 'team']
  },
  maxTeamSize: {
    type: Number,
    default: 1
  },
  rules: [{
    type: String
  }],
  prizes: {
    first: String,
    second: String,
    third: String
  },
  registrationFee: {
    type: Number,
    required: [true, 'Please provide registration fee'],
    min: 0
  },
  venue: String,
  date: {
    type: Date,
    required: [true, 'Please provide event date']
  },
  time: String,
  maxParticipants: {
    type: Number
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
  isActive: {
    type: Boolean,
    default: true
  },
  image: String
}, {
  timestamps: true
});

// Index for faster queries
eventSchema.index({ category: 1, isActive: 1 });
eventSchema.index({ date: 1 });

module.exports = mongoose.model('Event', eventSchema);
