require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'acgcet@edu.in' });
    
    if (existingAdmin) {
      console.log('⚠️ Admin user already exists!');
      console.log('Email:', existingAdmin.email);
      console.log('Role:', existingAdmin.role);
      process.exit(0);
    }

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin ACGCET',
      email: 'acgcet@edu.in',
      phone: '9999999999',
      password: 'Admin@123',
      college: 'ACGCET',
      department: 'Mechanical Engineering',
      year: '4',
      collegeLocation: 'Karaikudi',
      rollNumber: 'ADMIN001',
      role: 'admin',
      isVerified: true,
      termsAccepted: true,
      paymentStatus: 'verified'
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', adminUser.email);
    console.log('🔐 Password: Admin@123');
    console.log('👤 Role:', adminUser.role);
    console.log('🆔 ID:', adminUser._id);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
};

createAdminUser();
