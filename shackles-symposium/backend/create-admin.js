require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@acgcet.edu' });
    
    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists!');
      console.log('📧 Email: admin@acgcet.edu');
      console.log('🔑 Password: Admin@123');
      console.log('✅ You can login with these credentials');
      
      // Show admin details
      console.log('\n� Admin Details:');
      console.log(`  - Name: ${existingAdmin.name}`);
      console.log(`  - Email: ${existingAdmin.email}`);
      console.log(`  - Role: ${existingAdmin.role}`);
      console.log(`  - Payment Status: ${existingAdmin.paymentStatus}`);
      if (existingAdmin.participantId) {
        console.log(`  - Participant ID: ${existingAdmin.participantId}`);
      }
    } else {
      // Create new admin user (password will be hashed by pre-save hook)
      console.log('Creating new admin user...');
      const admin = await User.create({
        name: 'Admin',
        email: 'admin@acgcet.edu',
        password: 'Admin@123',
        role: 'admin',
        phone: '1234567890',
        college: 'ACGCET',
        department: 'Admin',
        year: '1',
        collegeLocation: 'Karaikudi',
        paymentStatus: 'verified'
      });
      console.log('✅ Admin user created:', admin.email);
      console.log('📧 Email: admin@acgcet.edu');
      console.log('🔑 Password: Admin@123');
    }

    // Show all pending payments
    const pendingUsers = await User.find({ paymentStatus: 'pending' }).select('name email registrationType paymentAmount');
    console.log(`\n📋 Pending payments (${pendingUsers.length}):`);
    pendingUsers.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) - ${user.registrationType} - ₹${user.paymentAmount}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createAdmin();
