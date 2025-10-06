require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./src/models/Event');

const updateAllEvents = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected\n');

    // Get all events
    const events = await Event.find({});
    console.log(`Found ${events.length} events to update\n`);

    for (const event of events) {
      console.log(`📝 Updating: ${event.name}`);
      
      // Update fields
      const updates = {
        // Set date to 24.10.2025 (October 24, 2025)
        date: new Date('2025-10-24T00:00:00.000Z'),
        
        // Remove registration fees and max participants
        $unset: {
          registrationFee: "",
          maxParticipants: "",
          prizes: "",
          registrationDeadline: ""
        }
      };

      // Fix teamSize - if it exists, convert to proper format
      if (event.teamSize) {
        // If teamSize has min/max, keep the max value as an integer
        if (event.teamSize.max) {
          updates.teamSize = { max: parseInt(event.teamSize.max) };
        } else if (event.teamSize.min) {
          updates.teamSize = { max: parseInt(event.teamSize.min) };
        }
      }

      await Event.updateOne(
        { _id: event._id },
        updates
      );
      
      console.log(`  ✅ Updated: ${event.name}`);
    }

    console.log('\n✅ All events updated successfully!');
    
    // Display updated events
    const updatedEvents = await Event.find({}).lean();
    console.log('\n📊 Sample Updated Event:');
    console.log(JSON.stringify(updatedEvents[0], null, 2));

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

updateAllEvents();
