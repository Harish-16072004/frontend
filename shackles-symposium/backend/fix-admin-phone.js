// Fix admin phone number script
const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI;

// User Schema (simplified)
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  role: String
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function fixAdminPhone() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find admin
    const admin = await User.findOne({ email: 'admin@acgcet.edu' });
    
    if (!admin) {
      console.log('❌ Admin user not found');
      return;
    }

    console.log('📋 Current admin details:');
    console.log(`   Name: ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Phone: ${admin.phone}`);
    console.log('');

    // Update phone to a proper admin number
    admin.phone = '9003849838';
    await admin.save();

    console.log('✅ Admin phone updated successfully!');
    console.log('📋 New admin details:');
    console.log(`   Name: ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Phone: ${admin.phone}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the fix
fixAdminPhone();
