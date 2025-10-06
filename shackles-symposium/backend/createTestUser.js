const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

const createTestUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'harishjayasankar01@gmail.co.re' });
    
    if (existingUser) {
      console.log('ℹ️  Test user already exists!');
      console.log('📧 Email:', existingUser.email);
      console.log('✅ Payment Status:', existingUser.paymentStatus);
      console.log('👤 Name:', existingUser.name);
      await mongoose.connection.close();
      return;
    }

    // Create test user
    const testUser = await User.create({
      name: 'Harish J',
      email: 'harishjayasankar01@gmail.co.re',
      phone: '1234567890',
      password: 'test123',  // Will be hashed automatically
      college: 'ACGCET',
      department: 'Mechanical Engineering',
      year: '3',
      collegeLocation: 'Karaikudi',
      registrationType: 'both',
      paymentAmount: 299,
      transactionId: 'TEST123456',
      paymentStatus: 'verified',
      paymentScreenshot: 'https://example.com/screenshot.jpg'
    });

    console.log('✅ Test user created successfully!');
    console.log('📧 Email:', testUser.email);
    console.log('🔒 Password: test123');
    console.log('✅ Payment Status:', testUser.paymentStatus);

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error creating test user:', error);
    process.exit(1);
  }
};

createTestUser();
