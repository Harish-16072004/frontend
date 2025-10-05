// Clean up dummy users script
const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI;

// User Schema (simplified)
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  college: String,
  department: String,
  year: String,
  registrationType: String,
  paymentStatus: String,
  participantId: String,
  role: String,
  createdAt: Date
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function cleanupDummyUsers() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get all users
    const allUsers = await User.find().sort('createdAt');
    console.log(`📊 Total users in database: ${allUsers.length}\n`);

    // Patterns to identify dummy/test users
    const dummyPatterns = [
      /test/i,
      /dummy/i,
      /sample/i,
      /example/i,
      /^user\d+$/i,
      /9999999999/,  // Dummy phone numbers
      /8888888888/,
      /7777777777/,
      /1234567890/,
      /0000000000/
    ];

    // Identify dummy users
    const dummyUsers = allUsers.filter(user => {
      // Check name
      if (dummyPatterns.some(pattern => pattern.test(user.name))) {
        return true;
      }
      // Check email
      if (dummyPatterns.some(pattern => pattern.test(user.email))) {
        return true;
      }
      // Check phone for dummy numbers
      if (user.phone && (
        user.phone === '9999999999' ||
        user.phone === '8888888888' ||
        user.phone === '7777777777' ||
        user.phone === '1234567890' ||
        user.phone === '0000000000' ||
        /^(\d)\1{9}$/.test(user.phone) // Repeating digits
      )) {
        return true;
      }
      return false;
    });

    console.log('🗑️  Dummy users to be removed:');
    console.log('═══════════════════════════════════════\n');
    
    if (dummyUsers.length === 0) {
      console.log('✨ No dummy users found! Database is clean.\n');
      return;
    }

    dummyUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name}`);
      console.log(`   📧 ${user.email}`);
      console.log(`   📱 ${user.phone}`);
      console.log(`   🏫 ${user.college}`);
      console.log(`   📊 Status: ${user.paymentStatus}`);
      console.log(`   🎫 ID: ${user.participantId || 'Not generated'}`);
      console.log('');
    });

    console.log(`\n⚠️  About to delete ${dummyUsers.length} dummy users...`);
    console.log('Press Ctrl+C to cancel in the next 5 seconds...\n');
    
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Delete dummy users (except admin)
    const dummyUserIds = dummyUsers
      .filter(u => u.role !== 'admin')
      .map(u => u._id);

    const result = await User.deleteMany({ _id: { $in: dummyUserIds } });

    console.log('═══════════════════════════════════════');
    console.log('✅ Cleanup Complete!');
    console.log('═══════════════════════════════════════');
    console.log(`🗑️  Deleted: ${result.deletedCount} users`);
    console.log(`✨ Remaining: ${allUsers.length - result.deletedCount} users\n`);

    // Show remaining users
    const remainingUsers = await User.find().sort('createdAt');
    console.log('📋 Remaining users in database:');
    console.log('═══════════════════════════════════════\n');
    
    remainingUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name}`);
      console.log(`   📧 ${user.email}`);
      console.log(`   📱 ${user.phone}`);
      console.log(`   👤 Role: ${user.role}`);
      console.log(`   📊 Payment: ${user.paymentStatus}`);
      console.log(`   🎫 ID: ${user.participantId || 'Not generated'}`);
      console.log('');
    });

    console.log('═══════════════════════════════════════');
    console.log('✨ Database cleanup successful!\n');

  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the cleanup
cleanupDummyUsers();
