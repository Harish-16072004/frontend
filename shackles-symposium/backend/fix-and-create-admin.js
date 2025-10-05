require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

const fixIndexAndCreateAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Drop the problematic index if it exists
    try {
      await User.collection.dropIndex('participantId_1');
      console.log('🗑️  Dropped old participantId index');
    } catch (err) {
      console.log('ℹ️  No existing participantId index to drop');
    }

    // Recreate the index with proper sparse option
    await User.collection.createIndex(
      { participantId: 1 },
      { unique: true, sparse: true }
    );
    console.log('✅ Created new sparse unique index on participantId');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@acgcet.edu' });
    
    if (existingAdmin) {
      console.log('\n✅ Admin user already exists!');
      console.log('═══════════════════════════════════════');
      console.log('📧 Email:    admin@acgcet.edu');
      console.log('🔑 Password: Admin@123');
      console.log('═══════════════════════════════════════');
      console.log('\n👤 Admin Details:');
      console.log(`  - Name: ${existingAdmin.name}`);
      console.log(`  - Email: ${existingAdmin.email}`);
      console.log(`  - Role: ${existingAdmin.role}`);
      console.log(`  - Phone: ${existingAdmin.phone}`);
      console.log(`  - Payment Status: ${existingAdmin.paymentStatus}`);
      if (existingAdmin.participantId) {
        console.log(`  - Participant ID: ${existingAdmin.participantId}`);
      }
    } else {
      // Create new admin user
      console.log('\n📝 Creating new admin user...');
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
        paymentStatus: 'verified',
        participantId: null // Explicitly set to null
      });
      
      console.log('\n✅ Admin user created successfully!');
      console.log('═══════════════════════════════════════');
      console.log('📧 Email:    admin@acgcet.edu');
      console.log('🔑 Password: Admin@123');
      console.log('═══════════════════════════════════════');
      console.log('\n👤 Admin Details:');
      console.log(`  - ID: ${admin._id}`);
      console.log(`  - Name: ${admin.name}`);
      console.log(`  - Email: ${admin.email}`);
      console.log(`  - Role: ${admin.role}`);
    }

    // Show statistics
    const totalUsers = await User.countDocuments();
    const pendingPayments = await User.countDocuments({ paymentStatus: 'pending' });
    const verifiedPayments = await User.countDocuments({ paymentStatus: 'verified' });
    const participantsWithId = await User.countDocuments({ participantId: { $ne: null } });

    console.log('\n📊 Database Statistics:');
    console.log(`  - Total Users: ${totalUsers}`);
    console.log(`  - Pending Payments: ${pendingPayments}`);
    console.log(`  - Verified Payments: ${verifiedPayments}`);
    console.log(`  - Participants with ID: ${participantsWithId}`);

    // Show pending payments if any
    if (pendingPayments > 0) {
      const pendingUsers = await User.find({ paymentStatus: 'pending' })
        .select('name email registrationType paymentAmount')
        .limit(5);
      
      console.log('\n📋 Recent Pending Payments:');
      pendingUsers.forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.name} (${user.email})`);
        console.log(`     Type: ${user.registrationType || 'N/A'} | Amount: ₹${user.paymentAmount || 0}`);
      });
      
      if (pendingPayments > 5) {
        console.log(`  ... and ${pendingPayments - 5} more`);
      }
    }

    console.log('\n🚀 You can now login to the admin dashboard!');
    console.log('   URL: http://localhost:3000/login');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
};

fixIndexAndCreateAdmin();
