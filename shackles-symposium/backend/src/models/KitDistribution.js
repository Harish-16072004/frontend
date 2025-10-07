/**
 * Kit Distribution Model
 * Tracks registration kit issuance to participants
 * TWO KITS: Workshop Day Kit + Events Day Kit
 */

const mongoose = require('mongoose');

const KitDistributionSchema = new mongoose.Schema({
  participantId: {
    type: String,
    required: [true, 'Participant ID is required'],
    unique: true,
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  registrationType: {
    type: String,
    enum: ['general', 'workshop', 'both'],
    required: true
  },
  
  // WORKSHOP DAY KIT
  workshopDayKit: {
    issued: {
      type: Boolean,
      default: false
    },
    issuedAt: {
      type: Date,
      default: null
    },
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    idCardNumber: {
      type: String,
      default: null
    },
    contents: [{
      item: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        default: 1
      }
    }],
    issuanceMethod: {
      type: String,
      enum: ['qr-scan', 'manual', 'registration-desk'],
      default: 'qr-scan'
    },
    collectionPoint: {
      type: String,
      enum: ['main-desk', 'workshop-desk', 'event-venue'],
      default: 'workshop-desk'
    },
    participantSignature: {
      type: String,
      default: null
    },
    deviceInfo: {
      userAgent: String,
      ipAddress: String
    },
    notes: {
      type: String,
      maxlength: 500
    }
  },
  
  // EVENTS DAY KIT
  eventsDayKit: {
    issued: {
      type: Boolean,
      default: false
    },
    issuedAt: {
      type: Date,
      default: null
    },
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    idCardNumber: {
      type: String,
      default: null
    },
    contents: [{
      item: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        default: 1
      }
    }],
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
    participantSignature: {
      type: String,
      default: null
    },
    deviceInfo: {
      userAgent: String,
      ipAddress: String
    },
    notes: {
      type: String,
      maxlength: 500
    }
  }
}, {
  timestamps: true
});


// Indexes for quick lookups
KitDistributionSchema.index({ participantId: 1 });
KitDistributionSchema.index({ user: 1 });
KitDistributionSchema.index({ 'workshopDayKit.issuedAt': -1 });
KitDistributionSchema.index({ 'eventsDayKit.issuedAt': -1 });

// Check if workshop kit already issued
KitDistributionSchema.statics.isWorkshopKitIssued = async function(participantId) {
  const kit = await this.findOne({ 
    participantId,
    'workshopDayKit.issued': true 
  });
  return !!kit;
};

// Check if events kit already issued
KitDistributionSchema.statics.isEventsKitIssued = async function(participantId) {
  const kit = await this.findOne({ 
    participantId,
    'eventsDayKit.issued': true 
  });
  return !!kit;
};

// Check if any kit issued (for backward compatibility)
KitDistributionSchema.statics.isKitIssued = async function(participantId) {
  const kit = await this.findOne({ participantId });
  if (!kit) return false;
  return kit.workshopDayKit.issued || kit.eventsDayKit.issued;
};

// Get kit distribution details
KitDistributionSchema.statics.getKitDetails = async function(participantId) {
  return await this.findOne({ participantId })
    .populate('user', 'name email phone college department')
    .populate('workshopDayKit.issuedBy', 'name email')
    .populate('eventsDayKit.issuedBy', 'name email');
};

// Define kit contents for Workshop Day
KitDistributionSchema.statics.getWorkshopDayKitContents = function() {
  return [
    { item: 'Workshop ID Card', quantity: 1 },
    { item: 'Workshop Material', quantity: 1 },
    { item: 'Workshop Schedule', quantity: 1 },
    { item: 'Workshop Toolkit', quantity: 1 },
    { item: 'Pen', quantity: 1 },
    { item: 'Notepad', quantity: 1 },
    { item: 'Workshop Badge', quantity: 1 },
    { item: 'Certificate Envelope', quantity: 1 }
  ];
};

// Define kit contents for Events Day
KitDistributionSchema.statics.getEventsDayKitContents = function() {
  return [
    { item: 'Event ID Card', quantity: 1 },
    { item: 'Event Schedule', quantity: 1 },
    { item: 'Event Bag', quantity: 1 },
    { item: 'Event Brochure', quantity: 1 },
    { item: 'Pen', quantity: 1 },
    { item: 'Notepad', quantity: 1 },
    { item: 'Event Badge', quantity: 1 },
    { item: 'Refreshment Coupon', quantity: 1 }
  ];
};

// Get kit contents by type (DEPRECATED - for backward compatibility)
KitDistributionSchema.statics.getKitContentsByType = function(registrationType) {
  console.warn('getKitContentsByType is deprecated. Use getWorkshopDayKitContents or getEventsDayKitContents');
  
  const kitTemplates = {
    general: this.getEventsDayKitContents(),
    workshop: this.getWorkshopDayKitContents(),
    both: [
      ...this.getWorkshopDayKitContents(),
      ...this.getEventsDayKitContents()
    ]
  };
  
  return kitTemplates[registrationType] || kitTemplates.general;
};

// Check eligibility for workshop kit
KitDistributionSchema.methods.canReceiveWorkshopKit = function() {
  return ['workshop', 'both'].includes(this.registrationType);
};

// Check eligibility for events kit
KitDistributionSchema.methods.canReceiveEventsKit = function() {
  return ['general', 'both'].includes(this.registrationType);
};

// Get kit status summary
KitDistributionSchema.methods.getKitStatus = function() {
  return {
    participantId: this.participantId,
    registrationType: this.registrationType,
    workshopKit: {
      eligible: this.canReceiveWorkshopKit(),
      issued: this.workshopDayKit.issued,
      issuedAt: this.workshopDayKit.issuedAt,
      idCardNumber: this.workshopDayKit.idCardNumber
    },
    eventsKit: {
      eligible: this.canReceiveEventsKit(),
      issued: this.eventsDayKit.issued,
      issuedAt: this.eventsDayKit.issuedAt,
      idCardNumber: this.eventsDayKit.idCardNumber
    },
    totalKitsIssued: (this.workshopDayKit.issued ? 1 : 0) + (this.eventsDayKit.issued ? 1 : 0)
  };
};

// Generate ID card number for workshop kit
KitDistributionSchema.pre('save', async function(next) {
  try {
    // Generate workshop day kit ID card number
    if (this.workshopDayKit.issued && !this.workshopDayKit.idCardNumber) {
      const count = await mongoose.model('KitDistribution').countDocuments({
        'workshopDayKit.issued': true
      });
      const paddedCount = String(count + 1).padStart(4, '0');
      this.workshopDayKit.idCardNumber = `SHACKLES-W-${paddedCount}`;
    }
    
    // Generate events day kit ID card number
    if (this.eventsDayKit.issued && !this.eventsDayKit.idCardNumber) {
      const count = await mongoose.model('KitDistribution').countDocuments({
        'eventsDayKit.issued': true
      });
      const paddedCount = String(count + 1).padStart(4, '0');
      this.eventsDayKit.idCardNumber = `SHACKLES-E-${paddedCount}`;
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('KitDistribution', KitDistributionSchema);
