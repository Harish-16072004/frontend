/**
 * Kit Distribution Model
 * Tracks registration kit issuance to participants
 */

const mongoose = require('mongoose');

const KitDistributionSchema = new mongoose.Schema({
  participantId: {
    type: String,
    required: [true, 'Participant ID is required'],
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  kitType: {
    type: String,
    enum: ['general', 'workshop', 'both'],
    required: true
  },
  kitContents: [{
    item: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      default: 1
    },
    issued: {
      type: Boolean,
      default: true
    }
  }],
  // Kit items based on registration type
  // General: ID Card, Event Schedule, Bag, Pen, Notepad
  // Workshop: Workshop Material, Certificate Template, Toolkit
  // Both: All of the above
  issuedAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  issuedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  issuanceMethod: {
    type: String,
    enum: ['qr-scan', 'manual', 'registration-desk'],
    default: 'qr-scan'
  },
  collectionPoint: {
    type: String,
    enum: ['main-desk', 'workshop-desk', 'event-venue'],
    default: 'main-desk'
  },
  verificationStatus: {
    type: String,
    enum: ['verified', 'unverified', 'duplicate'],
    default: 'verified'
  },
  participantSignature: {
    type: String, // Base64 or signature data
    default: null
  },
  idCardNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  notes: {
    type: String,
    maxlength: 500
  },
  deviceInfo: {
    userAgent: String,
    ipAddress: String
  }
}, {
  timestamps: true
});

// Indexes for quick lookups
KitDistributionSchema.index({ participantId: 1 });
KitDistributionSchema.index({ user: 1 });
KitDistributionSchema.index({ issuedAt: -1 });
KitDistributionSchema.index({ issuedBy: 1 });

// Check if kit already issued
KitDistributionSchema.statics.isKitIssued = async function(participantId) {
  const kit = await this.findOne({ participantId });
  return !!kit;
};

// Get kit distribution details
KitDistributionSchema.statics.getKitDetails = async function(participantId) {
  return await this.findOne({ participantId })
    .populate('user', 'name email phone college department')
    .populate('issuedBy', 'name email');
};

// Define kit contents based on registration type
KitDistributionSchema.statics.getKitContentsByType = function(registrationType) {
  const kitTemplates = {
    general: [
      { item: 'ID Card', quantity: 1, issued: true },
      { item: 'Event Schedule', quantity: 1, issued: true },
      { item: 'Event Bag', quantity: 1, issued: true },
      { item: 'Pen', quantity: 1, issued: true },
      { item: 'Notepad', quantity: 1, issued: true },
      { item: 'Event Brochure', quantity: 1, issued: true },
      { item: 'Badge', quantity: 1, issued: true }
    ],
    workshop: [
      { item: 'Workshop ID Card', quantity: 1, issued: true },
      { item: 'Workshop Material', quantity: 1, issued: true },
      { item: 'Workshop Schedule', quantity: 1, issued: true },
      { item: 'Certificate Template', quantity: 1, issued: true },
      { item: 'Pen', quantity: 1, issued: true },
      { item: 'Notepad', quantity: 1, issued: true },
      { item: 'Badge', quantity: 1, issued: true }
    ],
    both: [
      { item: 'ID Card (General + Workshop)', quantity: 1, issued: true },
      { item: 'Event Schedule', quantity: 1, issued: true },
      { item: 'Workshop Material', quantity: 1, issued: true },
      { item: 'Event Bag', quantity: 1, issued: true },
      { item: 'Pen', quantity: 2, issued: true },
      { item: 'Notepad', quantity: 1, issued: true },
      { item: 'Event Brochure', quantity: 1, issued: true },
      { item: 'Certificate Template', quantity: 1, issued: true },
      { item: 'Badge', quantity: 1, issued: true },
      { item: 'Workshop Toolkit', quantity: 1, issued: true }
    ]
  };
  
  return kitTemplates[registrationType] || kitTemplates.general;
};

// Generate ID card number
KitDistributionSchema.pre('save', async function(next) {
  if (!this.isNew || this.idCardNumber) {
    return next();
  }
  
  try {
    // Generate ID card number: SHACKLES-2025-XXXX
    const count = await mongoose.model('KitDistribution').countDocuments();
    const paddedCount = String(count + 1).padStart(4, '0');
    this.idCardNumber = `SHACKLES-2025-${paddedCount}`;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('KitDistribution', KitDistributionSchema);
