require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./src/models/Event');

const checkEvents = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Count all events
    const allEvents = await Event.find({});
    console.log(`\n📊 Total events in database: ${allEvents.length}`);

    // Count active events
    const activeEvents = await Event.find({ isActive: true });
    console.log(`✅ Active events: ${activeEvents.length}`);

    // Count by category
    const categories = ['technical', 'non-technical', 'special', 'workshop'];
    console.log('\n📋 Events by category:');
    for (const category of categories) {
      const count = await Event.countDocuments({ category, isActive: true });
      console.log(`   ${category}: ${count}`);
    }

    // Show all events
    console.log('\n📝 All events in database:');
    allEvents.forEach(event => {
      console.log(`   - ${event.name} (${event.category}) - Active: ${event.isActive}`);
    });

    // Check for technical events specifically
    console.log('\n🔍 Technical events query result:');
    const technicalEvents = await Event.find({ category: 'technical', isActive: true })
      .populate('coordinators', 'name email phone');
    
    if (technicalEvents.length === 0) {
      console.log('❌ No technical events found!');
      console.log('\n💡 Database might not have been seeded with events.');
      console.log('💡 Check if events were created with correct category field.');
    } else {
      console.log(`✅ Found ${technicalEvents.length} technical events:`);
      technicalEvents.forEach(event => {
        console.log(`   - ${event.name}`);
        console.log(`     Category: ${event.category}`);
        console.log(`     Active: ${event.isActive}`);
        console.log(`     ID: ${event._id}`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkEvents();
