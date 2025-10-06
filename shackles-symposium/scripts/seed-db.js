const mongoose = require('mongoose');
const User = require('../BACKEND/src/models/User');
const Event = require('../BACKEND/src/models/Event');
const Workshop = require('../BACKEND/src/models/Workshop');

require('dotenv').config({ path: '../BACKEND/.env' });

/**
 * Database Seeding Script
 * 
 * This script allows you to seed your database with initial data.
 * 
 * Usage:
 * 1. Define your data in the arrays below (users, events, workshops)
 * 2. Run: node scripts/seed-db.js
 * 
 * Note: This will clear existing data before seeding.
 */

// TODO: Add your user data here
const users = [
  // Example structure (remove this comment and add your data):
  // {
  //   name: 'Your Name',
  //   email: 'your.email@example.com',
  //   password: 'YourPassword123',
  //   phone: '1234567890',
  //   college: 'Your College',
  //   year: 'Year',
  //   branch: 'Branch',
  //   role: 'user', // or 'admin'
  //   isVerified: true
  // }
];

// TODO: Add your event data here
const events = [
  // Example structure (remove this comment and add your data):
  // {
  //   name: 'Event Name',
  //   description: 'Event Description',
  //   category: 'Technical', // or 'Cultural', 'Sports'
  //   venue: 'Venue Name',
  //   eventDate: new Date('2025-12-31'),
  //   registrationDeadline: new Date('2025-12-25'),
  //   maxParticipants: 100,
  //   registrationFee: 200,
  //   image: 'https://example.com/image.jpg',
  //   rules: ['Rule 1', 'Rule 2'],
  //   prizes: { first: 5000, second: 3000, third: 2000 },
  //   coordinators: [
  //     { name: 'Coordinator Name', phone: '1234567890', email: 'coordinator@example.com' }
  //   ],
  //   status: 'upcoming'
  // }
];

// TODO: Add your workshop data here
const workshops = [
  // Example structure (remove this comment and add your data):
  // {
  //   title: 'Workshop Title',
  //   description: 'Workshop Description',
  //   instructor: 'Instructor Name',
  //   instructorBio: 'Instructor Bio',
  //   duration: 'Duration',
  //   date: new Date('2025-12-31'),
  //   time: 'Time',
  //   venue: 'Venue',
  //   fee: 500,
  //   maxSeats: 50,
  //   image: 'https://example.com/image.jpg',
  //   syllabus: ['Topic 1', 'Topic 2'],
  //   prerequisites: ['Prerequisite 1'],
  //   certificateProvided: true,
  //   status: 'upcoming'
  // }
];

// Seed function
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Validate data
    if (users.length === 0 && events.length === 0 && workshops.length === 0) {
      console.log('⚠️  No data to seed. Please add data to the arrays in this file.\n');
      console.log('📝 Edit scripts/seed-db.js and add your data.\n');
      process.exit(0);
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data (optional - comment out if you don't want to clear)
    console.log('🗑️  Clearing existing data...');
    if (users.length > 0) await User.deleteMany({});
    if (events.length > 0) await Event.deleteMany({});
    if (workshops.length > 0) await Workshop.deleteMany({});
    console.log('✅ Existing data cleared\n');

    let createdUsers = [];
    let createdEvents = [];
    let createdWorkshops = [];

    // Seed Users
    if (users.length > 0) {
      console.log('👥 Seeding users...');
      createdUsers = await User.create(users);
      console.log(`✅ Created ${createdUsers.length} users\n`);
    }

    // Seed Events
    if (events.length > 0) {
      console.log('🎉 Seeding events...');
      createdEvents = await Event.create(events);
      console.log(`✅ Created ${createdEvents.length} events\n`);
    }

    // Seed Workshops
    if (workshops.length > 0) {
      console.log('📚 Seeding workshops...');
      createdWorkshops = await Workshop.create(workshops);
      console.log(`✅ Created ${createdWorkshops.length} workshops\n`);
    }

    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ DATABASE SEEDING COMPLETE!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`\n📊 Summary:`);
    console.log(`   • Users:     ${createdUsers.length}`);
    console.log(`   • Events:    ${createdEvents.length}`);
    console.log(`   • Workshops: ${createdWorkshops.length}`);
    console.log('\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seeder
seedDatabase();
