const mongoose = require('mongoose');
const Event = require('./src/models/Event');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Technical Events
const technicalEvents = [
  {
    name: 'Innovation Duel',
    category: 'technical',
    description: 'Present innovative research papers and engineering solutions.',
    venue: 'Main Auditorium',
    date: new Date('2025-10-23'),
    time: { start: '10:00 AM', end: '12:00 PM' },
    registrationDeadline: new Date('2025-10-20'),
    teamSize: { min: 2, max: 3 },
    registrationFee: 299,
    rules: [
      'Team size: 2-3 members',
      'Presentation time: 10 minutes',
      'Topic: Any mechanical engineering domain',
      'Abstract submission deadline: October 10, 2025',
      'PPT format required',
    ],
    prizes: { first: '₹5000', second: '₹3000', third: '₹2000' },
    coordinators: [{ name: 'Mogith', phone: '+91 6374763740', email: 'mogith@acgcet.ac.in' }],
    maxParticipants: 100,
    isActive: true,
  },
  {
    name: 'Brain Busters Arena',
    category: 'technical',
    description: 'Test your mechanical engineering knowledge across multiple rounds.',
    venue: 'Quiz Hall',
    date: new Date('2025-10-23'),
    time: { start: '11:00 AM', end: '1:00 PM' },
    registrationDeadline: new Date('2025-10-20'),
    teamSize: { min: 2, max: 2 },
    registrationFee: 299,
    rules: [
      'Team size: 2 members',
      '3 rounds: Prelims, Buzzer, Rapid Fire',
      'Topics: Thermodynamics, Mechanics, Manufacturing, etc.',
      'No electronic devices allowed',
      'Duration: 2 hours',
    ],
    prizes: { first: '₹5000', second: '₹3000', third: '₹2000' },
    coordinators: [{ name: 'Jeffery Shakil', phone: '+91 8778531340', email: 'jeffery@acgcet.ac.in' }],
    maxParticipants: 80,
    isActive: true,
  },
  {
    name: 'Dimensions Forge',
    category: 'technical',
    description: 'Design and model engineering components using CAD software.',
    venue: 'CAD Lab',
    date: new Date('2025-10-23'),
    time: { start: '2:00 PM', end: '5:00 PM' },
    registrationDeadline: new Date('2025-10-20'),
    teamSize: { min: 1, max: 1 },
    registrationFee: 299,
    rules: [
      'Individual participation',
      'Software: CATIA/SolidWorks/AutoCAD',
      'Duration: 3 hours',
      'Problem statement given on-site',
      'Own laptop required',
    ],
    prizes: { first: '₹5000', second: '₹3000', third: '₹2000' },
    coordinators: [{ name: 'Praveen', phone: '+91 9514585887', email: 'praveen@acgcet.ac.in' }],
    maxParticipants: 50,
    isActive: true,
  },
  {
    name: 'Sky Shot',
    category: 'technical',
    description: 'Build and launch water rockets to achieve maximum distance and accuracy.',
    venue: 'Sports Ground',
    date: new Date('2025-10-23'),
    time: { start: '3:00 PM', end: '5:00 PM' },
    registrationDeadline: new Date('2025-10-20'),
    teamSize: { min: 3, max: 4 },
    registrationFee: 299,
    rules: [
      'Team size: 3-4 members',
      'Rocket must be made on-site',
      'Materials provided',
      'Judged on distance and accuracy',
      'Safety protocols mandatory',
    ],
    prizes: { first: '₹5000', second: '₹3000', third: '₹2000' },
    coordinators: [{ name: 'Vignesh', phone: '+91 9361428799', email: 'vignesh@acgcet.ac.in' }],
    maxParticipants: 60,
    isActive: true,
  },
  {
    name: 'Engine Gamble',
    category: 'technical',
    description: 'Disassemble and reassemble motors against the clock.',
    venue: 'Workshop',
    date: new Date('2025-10-23'),
    time: { start: '4:00 PM', end: '6:00 PM' },
    registrationDeadline: new Date('2025-10-20'),
    teamSize: { min: 2, max: 2 },
    registrationFee: 299,
    rules: [
      'Team size: 2 members',
      'Time-based challenge',
      'Proper sequence required',
      'Tools provided',
      'Fastest team wins',
    ],
    prizes: { first: '₹5000', second: '₹3000', third: '₹2000' },
    coordinators: [{ name: 'Sanjay', phone: '+91 9384583077', email: 'sanjay@acgcet.ac.in' }],
    maxParticipants: 40,
    isActive: true,
  },
  {
    name: 'Mech Showdown',
    category: 'technical',
    description: 'Multiple mini-challenges testing diverse mechanical skills.',
    venue: 'Multi-Activity Zone',
    date: new Date('2025-10-23'),
    time: { start: '5:00 PM', end: '7:00 PM' },
    registrationDeadline: new Date('2025-10-20'),
    teamSize: { min: 3, max: 3 },
    registrationFee: 299,
    rules: [
      'Team size: 3 members',
      '5 different challenges',
      'Points-based system',
      'Time limit for each challenge',
      'Team with highest points wins',
    ],
    prizes: { first: '₹5000', second: '₹3000', third: '₹2000' },
    coordinators: [{ name: 'Shobith', phone: '+91 8098726547', email: 'shobith@acgcet.ac.in' }],
    maxParticipants: 50,
    isActive: true,
  },
];

// Non-Technical Events
const nonTechnicalEvents = [
  {
    name: 'Survival Bid',
    category: 'non-technical',
    description: 'Build your dream IPL team through strategic bidding and team management.',
    venue: 'Seminar Hall 1',
    date: new Date('2025-10-23'),
    time: { start: '10:00 AM', end: '12:00 PM' },
    registrationDeadline: new Date('2025-10-20'),
    teamSize: { min: 3, max: 4 },
    registrationFee: 299,
    rules: [
      'Team size: 3-4 members',
      'Virtual budget provided',
      'Multiple rounds of bidding',
      'Strategic team building required',
      'Points based on actual IPL performance',
    ],
    prizes: { first: '₹4000', second: '₹2500', third: '₹1500' },
    coordinators: [{ name: 'Abishek', phone: '+91 9384583077', email: 'abishek@acgcet.ac.in' }],
    maxParticipants: 80,
    isActive: true,
  },
  {
    name: 'Film Quest',
    category: 'non-technical',
    description: 'Test your knowledge of Tamil cinema across decades.',
    venue: 'Seminar Hall 2',
    date: new Date('2025-10-23'),
    time: { start: '11:30 AM', end: '1:00 PM' },
    registrationDeadline: new Date('2025-10-20'),
    teamSize: { min: 2, max: 2 },
    registrationFee: 299,
    rules: [
      'Team size: 2 members',
      '3 rounds: Visual, Audio, Rapid Fire',
      'Topics: Movies, actors, directors, music',
      'No phones allowed',
      'Duration: 1.5 hours',
    ],
    prizes: { first: '₹4000', second: '₹2500', third: '₹1500' },
    coordinators: [{ name: 'Dharun', phone: '+91 8098726547', email: 'dharun@acgcet.ac.in' }],
    maxParticipants: 60,
    isActive: true,
  },
  {
    name: 'Red Light Green Light',
    category: 'non-technical',
    description: 'The iconic Squid Game challenge - freeze on red, move on green!',
    venue: 'Open Arena',
    date: new Date('2025-10-23'),
    time: { start: '2:00 PM', end: '3:30 PM' },
    registrationDeadline: new Date('2025-10-20'),
    teamSize: { min: 1, max: 1 },
    registrationFee: 299,
    rules: [
      'Individual participation',
      'Movement only on "green light"',
      'Complete freeze on "red light"',
      'Any movement results in elimination',
      'First to finish line wins',
    ],
    prizes: { first: '₹4000', second: '₹2500', third: '₹1500' },
    coordinators: [{ name: 'Naveen', phone: '+91 9361428799', email: 'naveen@acgcet.ac.in' }],
    maxParticipants: 100,
    isActive: true,
  },
  {
    name: 'Dalgona Candy',
    category: 'non-technical',
    description: 'Extract delicate shapes from honeycomb candy without breaking them!',
    venue: 'Activity Zone',
    date: new Date('2025-10-23'),
    time: { start: '3:30 PM', end: '5:00 PM' },
    registrationDeadline: new Date('2025-10-20'),
    teamSize: { min: 1, max: 1 },
    registrationFee: 299,
    rules: [
      'Individual participation',
      'Time limit: 10 minutes',
      'Shape must be extracted perfectly',
      'No cracks or breaks allowed',
      'Precision and patience required',
    ],
    prizes: { first: '₹4000', second: '₹2500', third: '₹1500' },
    coordinators: [{ name: 'Event Team', phone: '+91 9384583077', email: 'events@acgcet.ac.in' }],
    maxParticipants: 80,
    isActive: true,
  },
];

// Special Events
const specialEvents = [
  {
    name: 'Vision Trial',
    category: 'special',
    description: 'Present your innovative business ideas to a panel of judges and investors.',
    venue: 'Innovation Hub',
    date: new Date('2025-10-23'),
    time: { start: '10:00 AM', end: '1:00 PM' },
    registrationDeadline: new Date('2025-10-20'),
    teamSize: { min: 2, max: 3 },
    registrationFee: 299,
    rules: [
      'Team size: 2-3 members',
      'Pitch duration: 5 minutes',
      'Q&A session: 3 minutes',
      'Idea must be original and innovative',
      'Presentation + prototype/mock-up required',
      'Focus on feasibility and market potential',
    ],
    prizes: { first: '₹10000', second: '₹6000', third: '₹4000' },
    coordinators: [{ name: 'Gokul S', phone: '+91 9514585887', email: 'gokul@acgcet.ac.in' }],
    maxParticipants: 30,
    isActive: true,
  },
  {
    name: 'Robo Rumble',
    category: 'special',
    description: 'Build and control robots to compete in an exciting soccer match.',
    venue: 'Robotics Arena',
    date: new Date('2025-10-23'),
    time: { start: '2:00 PM', end: '5:00 PM' },
    registrationDeadline: new Date('2025-10-20'),
    teamSize: { min: 3, max: 4 },
    registrationFee: 299,
    rules: [
      'Team size: 3-4 members',
      'Robot specifications: Max 30cm × 30cm × 30cm',
      'Wired/Wireless control allowed',
      'Match duration: 10 minutes',
      'Standard soccer rules apply',
      'Robot must be built on-site (materials provided)',
    ],
    prizes: { first: '₹10000', second: '₹6000', third: '₹4000' },
    coordinators: [{ name: 'Sharun', phone: '+91 9384583077', email: 'sharun@acgcet.ac.in' }],
    maxParticipants: 40,
    isActive: true,
  },
];

// Seed function
async function seedEvents() {
  try {
    console.log('🗑️  Clearing existing events...');
    await Event.deleteMany({});
    
    console.log('📝 Creating Technical Events...');
    const technical = await Event.insertMany(technicalEvents);
    console.log(`✅ Created ${technical.length} technical events`);
    
    console.log('📝 Creating Non-Technical Events...');
    const nonTechnical = await Event.insertMany(nonTechnicalEvents);
    console.log(`✅ Created ${nonTechnical.length} non-technical events`);
    
    console.log('📝 Creating Special Events...');
    const special = await Event.insertMany(specialEvents);
    console.log(`✅ Created ${special.length} special events`);
    
    console.log('\n🎉 All events seeded successfully!');
    console.log(`Total events created: ${technical.length + nonTechnical.length + special.length}`);
    
    // Display created events with IDs
    console.log('\n📋 Created Events:');
    console.log('\n=== TECHNICAL EVENTS ===');
    technical.forEach(event => {
      console.log(`  • ${event.name} (ID: ${event._id})`);
    });
    
    console.log('\n=== NON-TECHNICAL EVENTS ===');
    nonTechnical.forEach(event => {
      console.log(`  • ${event.name} (ID: ${event._id})`);
    });
    
    console.log('\n=== SPECIAL EVENTS ===');
    special.forEach(event => {
      console.log(`  • ${event.name} (ID: ${event._id})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding events:', error);
    process.exit(1);
  }
}

// Run seed function
seedEvents();
