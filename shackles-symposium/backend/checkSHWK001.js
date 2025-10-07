require('dotenv').config();
const mongoose = require('mongoose');

async function checkUserRegistrations() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000
    });
    console.log('✅ Connected to MongoDB');

    const User = require('./src/models/User');
    const EventRegistration = require('./src/models/EventRegistration');

    // Find SHWK001 user
    const user = await User.findOne({ participantId: 'SHWK001' });
    
    if (!user) {
      console.log('❌ User SHWK001 not found');
      process.exit(1);
    }

    console.log('\n👤 User Found:');
    console.log('   Name:', user.name);
    console.log('   Email:', user.email);
    console.log('   Participant ID:', user.participantId);
    console.log('   User _id:', user._id);
    console.log('   Registration Type:', user.registrationType);
    console.log('   Payment Status:', user.paymentStatus);

    // Find all event registrations
    const eventRegs = await EventRegistration.find({ user: user._id })
      .populate('event', 'name category')
      .populate('workshop', 'title');

    console.log('\n📋 EventRegistrations Collection:');
    console.log('   Total registrations found:', eventRegs.length);
    
    if (eventRegs.length > 0) {
      eventRegs.forEach((reg, i) => {
        console.log(`\n   ${i + 1}. Registration ID: ${reg._id}`);
        console.log(`      Event: ${reg.event?.name || 'None'} (${reg.event?.category || 'N/A'})`);
        console.log(`      Workshop: ${reg.workshop?.title || 'None'}`);
        console.log(`      Event Type: ${reg.eventType}`);
        console.log(`      Status: ${reg.status}`);
        console.log(`      Registered At: ${reg.registeredAt}`);
      });
    } else {
      console.log('   ⚠️ No registrations found for this user');
    }

    // Check total registrations in collection
    const totalRegs = await EventRegistration.countDocuments();
    console.log(`\n📊 Total registrations in database: ${totalRegs}`);
    
    // Check if there are any registrations at all
    if (totalRegs > 0) {
      const sampleRegs = await EventRegistration.find().limit(3)
        .populate('user', 'participantId name')
        .populate('event', 'name')
        .populate('workshop', 'title');
      
      console.log('\n📋 Sample registrations from database:');
      sampleRegs.forEach((reg, i) => {
        console.log(`   ${i + 1}. User: ${reg.user?.participantId || 'N/A'} - Event: ${reg.event?.name || 'N/A'} - Workshop: ${reg.workshop?.title || 'N/A'}`);
      });
    }

    // Also check the old Registration collection
    const Registration = require('./src/models/Registration');
    const oldRegs = await Registration.find({ user: user._id })
      .populate('event', 'name')
      .populate('workshop', 'title');

    console.log('\n📋 Registration Collection (Old):');
    console.log('   Total registrations found:', oldRegs.length);
    
    if (oldRegs.length > 0) {
      oldRegs.forEach((reg, i) => {
        console.log(`\n   ${i + 1}. Registration #: ${reg.registrationNumber}`);
        console.log(`      Type: ${reg.type}`);
        console.log(`      Event: ${reg.event?.name || 'None'}`);
        console.log(`      Workshop: ${reg.workshop?.title || 'None'}`);
        console.log(`      Status: ${reg.status}`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkUserRegistrations();
