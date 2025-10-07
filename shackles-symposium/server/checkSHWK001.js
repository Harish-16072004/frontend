require('dotenv').config();
const mongoose = require('mongoose');

async function checkUserRegistrations() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shackles_db', {
      serverSelectionTimeoutMS: 30000
    });
    console.log('✅ Connected to MongoDB');

    const User = require('./models/User');
    const Registration = require('./models/Registration');

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

    // Find all registrations
    const regs = await Registration.find({ userId: user._id })
      .populate('eventId', 'name type');

    console.log('\n📋 Registrations:');
    console.log('   Total found:', regs.length);
    
    if (regs.length > 0) {
      regs.forEach((reg, i) => {
        console.log(`\n   ${i + 1}. Registration #${reg.registrationNumber}`);
        console.log(`      Event: ${reg.eventId?.name || 'Unknown'}`);
        console.log(`      Event Type: ${reg.eventId?.type || 'N/A'}`);
        console.log(`      Payment Status: ${reg.paymentStatus}`);
        console.log(`      Created: ${reg.createdAt}`);
      });
    } else {
      console.log('   ⚠️ No registrations found');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkUserRegistrations();
