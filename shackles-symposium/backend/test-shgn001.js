const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const Registration = require('./src/models/Registration');
const User = require('./src/models/User');
const Event = require('./src/models/Event');

async function testSHGN001() {
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

    console.log('👤 User Found:', user.participantId);
    console.log('   User ID:', user._id);
    console.log('   Name:', user.name);
    console.log('   Email:', user.email, '\n');

    // Check all registrations for this user
    console.log('📋 Checking Registrations Collection:\n');
    const registrations = await Registration.find({ user: user._id });
    console.log(`Found ${registrations.length} registration(s) in database\n`);

    registrations.forEach((reg, index) => {
      console.log(`Registration ${index + 1}:`);
      console.log('  _id:', reg._id);
      console.log('  type:', reg.type);
      console.log('  status:', reg.status);
      console.log('  paymentStatus:', reg.paymentStatus);
      console.log('  event:', reg.event);
      console.log('  workshop:', reg.workshop);
      console.log('---');
    });

    // Now simulate the exact API call with population
    console.log('\n\n📡 Simulating API Call: GET /api/v1/registrations/my-registrations\n');
    const populatedRegs = await Registration.find({ user: user._id })
      .populate('event', 'name category date venue fees')
      .populate('workshop', 'title date venue fees')
      .sort('-createdAt');

    console.log(`API returned ${populatedRegs.length} registration(s)\n`);

    populatedRegs.forEach((reg, index) => {
      console.log(`Registration ${index + 1} (with population):`);
      console.log('  Type:', reg.type);
      console.log('  Status:', reg.status);
      console.log('  Payment:', reg.paymentStatus);
      
      if (reg.type === 'event') {
        console.log('  Event Object:', reg.event);
        if (reg.event) {
          console.log('    Event Name:', reg.event.name);
        } else {
          console.log('    ⚠️ Event is NULL or undefined!');
        }
      } else if (reg.type === 'workshop') {
        console.log('  Workshop Object:', reg.workshop);
        if (reg.workshop) {
          console.log('    Workshop Title:', reg.workshop.title);
        } else {
          console.log('    ⚠️ Workshop is NULL or undefined!');
        }
      }
      console.log('---');
    });

    // Frontend parsing simulation
    console.log('\n\n🔍 Frontend Parsing Simulation:\n');
    const events = [];
    const workshops = [];

    populatedRegs.forEach((reg, index) => {
      console.log(`Processing Registration ${index + 1}:`);
      console.log(`  reg.type: ${reg.type}`);
      console.log(`  reg.event exists: ${!!reg.event}`);
      console.log(`  reg.workshop exists: ${!!reg.workshop}`);

      if (reg.type === 'workshop' && reg.workshop) {
        const wName = reg.workshop.title || reg.workshop.name || reg.workshop;
        console.log(`  ✅ Adding workshop: ${wName}`);
        workshops.push(wName);
      } else if (reg.type === 'event' && reg.event) {
        const eName = reg.event.name || reg.event.title || reg.event;
        console.log(`  ✅ Adding event: ${eName}`);
        events.push(eName);
      } else {
        console.log('  ⚠️ Skipped - does not match conditions');
        if (reg.type === 'event' && !reg.event) {
          console.log('     Issue: type is "event" but reg.event is null/undefined');
        }
        if (reg.type === 'workshop' && !reg.workshop) {
          console.log('     Issue: type is "workshop" but reg.workshop is null/undefined');
        }
      }
      console.log('---');
    });

    console.log('\n\n✅ FINAL RESULT:');
    console.log(`  Events Array: [${events.join(', ')}]`);
    console.log(`  Events Count: ${events.length}`);
    console.log(`  Workshops Array: [${workshops.join(', ')}]`);
    console.log(`  Workshops Count: ${workshops.length}`);

    console.log('\n\n🎯 EXPECTED UI DISPLAY:');
    console.log(`  Events section: ${events.length > 0 ? 'SHOULD SHOW' : 'HIDDEN'}`);
    console.log(`  Workshops section: ${workshops.length > 0 ? 'SHOULD SHOW' : 'HIDDEN'}`);

    // Additional check - verify the Event documents exist
    if (registrations.some(r => r.type === 'event')) {
      console.log('\n\n🔍 Checking Event Documents in Database:\n');
      const eventIds = registrations.filter(r => r.type === 'event').map(r => r.event);
      console.log('Event IDs in registrations:', eventIds);
      
      for (const eventId of eventIds) {
        if (eventId) {
          const event = await Event.findById(eventId);
          if (event) {
            console.log(`  ✅ Event found: ${event.name} (ID: ${event._id})`);
          } else {
            console.log(`  ❌ Event NOT FOUND for ID: ${eventId}`);
          }
        }
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

testSHGN001();
