require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./src/models/Event');

const testEventResponse = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected\n');

    const events = await Event.find({ 
      category: 'technical', 
      isActive: true 
    })
      .populate('coordinators', 'name email phone')
      .sort('date')
      .lean();

    console.log(`Found ${events.length} technical events\n`);
    
    if (events.length > 0) {
      console.log('📋 First event structure:');
      console.log(JSON.stringify(events[0], null, 2));
      
      console.log('\n🔍 Checking coordinator field:');
      console.log('event.coordinator:', events[0].coordinator);
      console.log('event.coordinators:', events[0].coordinators);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testEventResponse();
