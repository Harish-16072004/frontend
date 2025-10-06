require('dotenv').config();
const mongoose = require('mongoose');
const Workshop = require('./src/models/Workshop');

const workshops = [
  {
    title: 'Additive Manufacturing Workshop',
    description: 'Dive into the revolutionary world of 3D printing and additive manufacturing. This comprehensive hands-on workshop covers the fundamentals of additive manufacturing technologies, CAD design principles for 3D printing, material science, and practical operation of professional 3D printers. Learn how to transform digital designs into physical objects and understand the industrial applications of this transformative technology.',
    instructor: {
      name: 'Dr. Rajesh Kumar',
      designation: 'Senior Research Engineer',
      organization: 'National Institute of Advanced Manufacturing',
      bio: 'Expert in additive manufacturing with 15+ years of experience in industrial 3D printing and rapid prototyping.'
    },
    duration: {
      hours: 3
    },
    schedule: [{
      date: new Date('2025-10-23T10:00:00.000Z'),
      startTime: '10:00 AM',
      endTime: '1:00 PM',
      topic: 'Complete Additive Manufacturing Training'
    }],
    venue: 'Innovation Lab, Mechanical Department, ACGCET',
    registrationFee: 0, // Included in symposium fee
    maxParticipants: 50,
    currentParticipants: 0,
    prerequisites: [
      'Basic understanding of CAD software',
      'Interest in manufacturing technology',
      'Laptop recommended (not mandatory)'
    ],
    learningOutcomes: [
      'Introduction to Additive Manufacturing Technologies',
      'Types of 3D Printing: FDM, SLA, SLS, and more',
      'CAD Design Principles for 3D Printing',
      'Material Selection and Properties',
      'Hands-on 3D Printer Operation',
      'Post-Processing and Finishing Techniques',
      'Industrial Applications and Case Studies'
    ],
    status: 'upcoming',
    isActive: true,
    registrationDeadline: new Date('2025-10-22T23:59:59.000Z'),
    certificate: true,
    tags: ['3d-printing', 'manufacturing', 'cad', 'technology', 'hands-on']
  },
  {
    title: 'IoT (Internet of Things) Workshop',
    description: 'Embark on a journey into the interconnected world of IoT! This practical workshop provides comprehensive training in building smart IoT devices from scratch. Learn to program microcontrollers like Arduino and ESP32, integrate various sensors, connect devices to cloud platforms, and create real-world IoT applications. Perfect for aspiring engineers who want to build the smart devices of tomorrow.',
    instructor: {
      name: 'Prof. Anitha Sharma',
      designation: 'IoT Solutions Architect',
      organization: 'TechNova Solutions',
      bio: 'Certified IoT professional with extensive experience in smart city projects and industrial IoT implementations.'
    },
    duration: {
      hours: 3
    },
    schedule: [{
      date: new Date('2025-10-23T14:00:00.000Z'),
      startTime: '2:00 PM',
      endTime: '5:00 PM',
      topic: 'Complete IoT Development Training'
    }],
    venue: 'Electronics Lab, Electrical Department, ACGCET',
    registrationFee: 0, // Included in symposium fee
    maxParticipants: 50,
    currentParticipants: 0,
    prerequisites: [
      'Basic programming knowledge (C/C++ preferred)',
      'Interest in electronics and embedded systems',
      'Laptop required for programming exercises'
    ],
    learningOutcomes: [
      'Introduction to IoT Architecture and Ecosystem',
      'Arduino and ESP32 Microcontroller Programming',
      'Sensor Integration: Temperature, Humidity, Motion, etc.',
      'Wireless Communication: WiFi, Bluetooth, MQTT',
      'Cloud Platforms: ThingSpeak, Blynk, AWS IoT',
      'Building Smart Home Automation Projects',
      'Real-world IoT Applications in Industry 4.0'
    ],
    status: 'upcoming',
    isActive: true,
    registrationDeadline: new Date('2025-10-22T23:59:59.000Z'),
    certificate: true,
    tags: ['iot', 'arduino', 'esp32', 'sensors', 'cloud', 'smart-devices', 'hands-on']
  }
];

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 75000,
  connectTimeoutMS: 30000,
})
.then(async () => {
  console.log('✅ Connected to MongoDB');
  console.log('📝 Creating workshops in workshops collection...\n');

  for (const workshopData of workshops) {
    try {
      // Check if workshop already exists
      const existing = await Workshop.findOne({ title: workshopData.title });
      
      if (existing) {
        console.log(`⚠️  Workshop already exists: ${workshopData.title}`);
        console.log(`   - Updating existing workshop...`);
        
        // Update the existing workshop
        await Workshop.findByIdAndUpdate(existing._id, workshopData);
        console.log(`   ✅ Updated successfully\n`);
        continue;
      }

      // Create new workshop
      const created = await Workshop.create(workshopData);
      console.log(`✅ Created: ${created.title}`);
      console.log(`   - ID: ${created._id}`);
      console.log(`   - Instructor: ${created.instructor.name}`);
      console.log(`   - Date: ${created.schedule[0].date.toLocaleDateString()}`);
      console.log(`   - Time: ${created.schedule[0].startTime} - ${created.schedule[0].endTime}`);
      console.log(`   - Venue: ${created.venue}`);
      console.log(`   - Max Participants: ${created.maxParticipants}`);
      console.log(`   - Learning Outcomes: ${created.learningOutcomes.length} topics`);
      console.log(`   - Prerequisites: ${created.prerequisites.length} items\n`);
    } catch (error) {
      console.error(`❌ Error creating/updating ${workshopData.title}:`, error.message);
    }
  }

  // Verify workshops were created
  const workshopCount = await Workshop.countDocuments({ isActive: true });
  console.log(`\n✅ Total active workshops in database: ${workshopCount}`);
  
  // List all workshops
  const allWorkshops = await Workshop.find({ isActive: true });
  console.log('\n📋 All Active Workshops:');
  allWorkshops.forEach(w => {
    console.log(`   - ${w.title} (ID: ${w._id})`);
  });

  console.log('\n✅ Workshop creation complete!');
  console.log('🔗 API endpoint: http://localhost:5000/api/v1/workshops');
  
  process.exit(0);
})
.catch(error => {
  console.error('❌ Database connection error:', error.message);
  process.exit(1);
});
