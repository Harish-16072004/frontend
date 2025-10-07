const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');

async function checkAllRegistrations() {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;

    // Get all collections
    const collections = await db.listCollections().toArray();
    console.log('📚 Available Collections:\n');
    collections.forEach(col => console.log('  -', col.name));

    // Find user SHGN001
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ participantId: 'SHGN001' });
    
    if (!user) {
      console.log('\n❌ User SHGN001 not found');
      process.exit(1);
    }

    console.log('\n\n👤 User ID:', user._id);

    // Check registrations collection
    console.log('\n\n📋 Checking "registrations" collection:');
    const registrationsCollection = db.collection('registrations');
    const registrations = await registrationsCollection.find({ user: user._id }).toArray();
    console.log(`Found ${registrations.length} document(s)\n`);
    registrations.forEach((reg, index) => {
      console.log(`Registration ${index + 1}:`);
      console.log('  Type:', reg.type);
      console.log('  Event ID:', reg.event);
      console.log('  Workshop ID:', reg.workshop);
      console.log('  Status:', reg.status);
      console.log('---');
    });

    // Check eventregistrations collection
    console.log('\n\n🎯 Checking "eventregistrations" collection:');
    const eventRegsCollection = db.collection('eventregistrations');
    const eventRegs = await eventRegsCollection.find({ user: user._id }).toArray();
    console.log(`Found ${eventRegs.length} document(s)\n`);
    eventRegs.forEach((reg, index) => {
      console.log(`Event Registration ${index + 1}:`);
      console.log('  Event ID:', reg.event);
      console.log('  Status:', reg.status);
      console.log('  Payment Status:', reg.paymentStatus);
      console.log('---');
    });

    // If there are event registrations, get the event names
    if (eventRegs.length > 0) {
      console.log('\n\n📝 Event Details:');
      const eventsCollection = db.collection('events');
      for (const reg of eventRegs) {
        if (reg.event) {
          const event = await eventsCollection.findOne({ _id: reg.event });
          if (event) {
            console.log(`  ✅ Event: ${event.name} (Category: ${event.category})`);
          } else {
            console.log(`  ❌ Event not found for ID: ${reg.event}`);
          }
        }
      }
    }

    console.log('\n\n💡 ANALYSIS:');
    console.log(`  Registrations (workshops): ${registrations.length}`);
    console.log(`  EventRegistrations (events): ${eventRegs.length}`);
    console.log('\n  The profile page is looking at the "registrations" collection only.');
    console.log('  If events are in "eventregistrations" collection, they won\'t show up!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

checkAllRegistrations();
