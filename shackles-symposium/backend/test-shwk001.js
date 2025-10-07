const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const Registration = require('./src/models/Registration');
const User = require('./src/models/User');
const Workshop = require('./src/models/Workshop');
const Event = require('./src/models/Event');

async function checkSHWK001() {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('❌ MONGODB_URI not found in .env file');
      console.log('Available env vars:', Object.keys(process.env).filter(k => k.includes('MONGO')));
      process.exit(1);
    }
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Find user with participantId SHWK001
    const user = await User.findOne({ participantId: 'SHWK001' });
    if (!user) {
      console.log('❌ User SHWK001 not found');
      process.exit(1);
    }

    console.log('\n📋 User SHWK001 Details:');
    console.log('  Name:', user.name);
    console.log('  Email:', user.email);
    console.log('  Participant ID:', user.participantId);
    console.log('  Payment Status:', user.paymentStatus);
    console.log('  Registration Type:', user.registrationType);
    console.log('  User ID:', user._id);

    // Find all registrations for this user
    const registrations = await Registration.find({ user: user._id })
      .populate('workshop', 'title _id')
      .populate('event', 'name _id category');

    console.log(`\n📦 Found ${registrations.length} registrations for SHWK001:\n`);
    
    registrations.forEach((reg, index) => {
      console.log(`Registration ${index + 1}:`);
      console.log('  Registration Number:', reg.registrationNumber);
      console.log('  Type:', reg.type);
      console.log('  Status:', reg.status);
      console.log('  Payment Status:', reg.paymentStatus);
      
      if (reg.type === 'workshop' && reg.workshop) {
        console.log('  Workshop:', reg.workshop.title);
        console.log('  Workshop ID:', reg.workshop._id);
      }
      
      if (reg.type === 'event' && reg.event) {
        console.log('  Event:', reg.event.name);
        console.log('  Event ID:', reg.event._id);
        console.log('  Event Category:', reg.event.category);
      }
      console.log('---');
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkSHWK001();
