require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const EventRegistration = require('./src/models/EventRegistration');
const Event = require('./src/models/Event');

const checkAndFixRegistrations = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected\n');

    // Find user SHWK001
    const user = await User.findOne({ participantId: 'SHWK001' });
    
    if (!user) {
      console.log('❌ User SHWK001 not found');
      process.exit(1);
    }

    console.log('👤 User Details:');
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Registration Type: ${user.registrationType || 'NOT SET'}`);
    console.log(`   Payment Amount: ₹${user.paymentAmount}`);
    console.log(`   Payment Status: ${user.paymentStatus}\n`);

    // Get all registrations for this user
    const registrations = await EventRegistration.find({ user: user._id })
      .populate('event', 'name category');

    console.log(`📋 Current Registrations (${registrations.length}):`);
    
    const invalidRegistrations = [];
    const validRegistrations = [];

    for (const reg of registrations) {
      const event = reg.event;
      console.log(`\n   Event: ${event.name}`);
      console.log(`   Category: ${event.category}`);
      console.log(`   Registration Type: ${reg.eventType}`);
      
      // Check if registration is valid based on user's plan
      let isValid = false;
      let reason = '';

      if (!user.registrationType) {
        isValid = false;
        reason = 'User has no registration type set';
      } else if (user.registrationType === 'workshop' && event.category !== 'workshop') {
        isValid = false;
        reason = `Workshop plan can't register for ${event.category} events`;
      } else if (user.registrationType === 'general' && event.category === 'workshop') {
        isValid = false;
        reason = 'General plan can\'t register for workshops';
      } else if (user.registrationType === 'both') {
        isValid = true;
        reason = 'Both plan - can register for anything';
      } else if (user.registrationType === 'general' && event.category !== 'workshop') {
        isValid = true;
        reason = 'General plan - event registration allowed';
      } else if (user.registrationType === 'workshop' && event.category === 'workshop') {
        isValid = true;
        reason = 'Workshop plan - workshop registration allowed';
      }

      if (isValid) {
        console.log(`   ✅ VALID: ${reason}`);
        validRegistrations.push(reg);
      } else {
        console.log(`   ❌ INVALID: ${reason}`);
        invalidRegistrations.push(reg);
      }
    }

    // Remove invalid registrations
    if (invalidRegistrations.length > 0) {
      console.log(`\n⚠️  Found ${invalidRegistrations.length} INVALID registrations to remove:`);
      
      for (const reg of invalidRegistrations) {
        console.log(`   Removing: ${reg.event.name}`);
        await EventRegistration.deleteOne({ _id: reg._id });
      }
      
      console.log(`\n✅ Removed ${invalidRegistrations.length} invalid registrations`);
    } else {
      console.log('\n✅ All registrations are valid!');
    }

    console.log(`\n📊 Final Status:`);
    console.log(`   Valid Registrations: ${validRegistrations.length}`);
    console.log(`   Removed: ${invalidRegistrations.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkAndFixRegistrations();
