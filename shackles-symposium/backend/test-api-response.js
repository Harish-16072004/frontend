const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const Registration = require('./src/models/Registration');
const User = require('./src/models/User');
const Workshop = require('./src/models/Workshop');
const Event = require('./src/models/Event');

async function testAPIResponse() {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    // Find user SHWK001
    const user = await User.findOne({ participantId: 'SHWK001' });
    if (!user) {
      console.log('❌ User not found');
      process.exit(1);
    }

    console.log('👤 Simulating API call for user:', user.participantId);
    console.log('   User ID:', user._id, '\n');

    // Simulate the exact API call: GET /api/v1/registrations/my-registrations
    const registrations = await Registration.find({ user: user._id })
      .populate('event', 'name category date venue fees')
      .populate('workshop', 'title date venue fees')
      .sort('-createdAt');

    console.log('📦 API Response (what frontend receives):\n');
    console.log(JSON.stringify({
      success: true,
      count: registrations.length,
      data: registrations
    }, null, 2));

    console.log('\n\n📋 Frontend Parsing Logic:\n');
    const events = [];
    const workshops = [];

    registrations.forEach((reg, index) => {
      console.log(`Registration ${index + 1}:`);
      console.log('  Type:', reg.type);
      
      if (reg.type === 'workshop' && reg.workshop) {
        const wName = reg.workshop.title || reg.workshop.name || reg.workshop;
        console.log('  ✅ Workshop found:', wName);
        workshops.push(wName);
      } else if (reg.type === 'event' && reg.event) {
        const eName = reg.event.name || reg.event.title || reg.event;
        console.log('  ✅ Event found:', eName);
        events.push(eName);
      } else {
        console.log('  ❌ No event or workshop found for this registration');
        console.log('  reg.event:', reg.event);
        console.log('  reg.workshop:', reg.workshop);
      }
      console.log('---');
    });

    console.log('\n✅ Final Result:');
    console.log('  Events:', events);
    console.log('  Workshops:', workshops);
    console.log('\n🎯 Expected Display:');
    console.log(`  Workshops section should ${workshops.length > 0 ? 'SHOW' : 'HIDE'}`);
    console.log(`  Number of workshop badges: ${workshops.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testAPIResponse();
