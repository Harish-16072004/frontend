const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const User = require('./src/models/User');

async function checkUserSHGN001() {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    // Find user SHGN001
    const user = await User.findOne({ participantId: 'SHGN001' });
    if (!user) {
      console.log('❌ User SHGN001 not found');
      process.exit(1);
    }

    console.log('👤 User SHGN001 Full Document:\n');
    console.log(JSON.stringify(user, null, 2));

    console.log('\n\n📊 User Registration Summary:');
    console.log('  Participant ID:', user.participantId);
    console.log('  Name:', user.name);
    console.log('  Email:', user.email);
    console.log('  Registration Type:', user.registrationType);
    console.log('  Payment Status:', user.paymentStatus);
    console.log('  Payment Amount:', user.paymentAmount);
    console.log('\n  Events in User document:', user.events || 'Not found');
    console.log('  Workshops in User document:', user.workshops || 'Not found');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkUserSHGN001();
