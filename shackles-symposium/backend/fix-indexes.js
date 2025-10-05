require('dotenv').config();
const mongoose = require('mongoose');

const fixDatabaseIndexes = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Get all existing indexes
    const indexes = await usersCollection.indexes();
    console.log('\n📋 Current Indexes:');
    indexes.forEach(index => {
      console.log(`  - ${JSON.stringify(index)}`);
    });

    // Drop the participantId index if it exists
    try {
      await usersCollection.dropIndex('participantId_1');
      console.log('\n🗑️  Dropped participantId_1 index');
    } catch (err) {
      console.log('\nℹ️  participantId_1 index does not exist or already dropped');
    }

    // Update all users with null participantId to undefined
    const result = await usersCollection.updateMany(
      { participantId: null },
      { $unset: { participantId: "" } }
    );
    console.log(`\n🔄 Removed participantId field from ${result.modifiedCount} users`);

    // Create the proper sparse unique index
    await usersCollection.createIndex(
      { participantId: 1 },
      { 
        unique: true, 
        sparse: true,
        name: 'participantId_1'
      }
    );
    console.log('✅ Created sparse unique index on participantId');

    // Verify the new index
    const newIndexes = await usersCollection.indexes();
    const participantIdIndex = newIndexes.find(idx => idx.name === 'participantId_1');
    
    console.log('\n✅ New participantId index:');
    console.log(`   ${JSON.stringify(participantIdIndex)}`);
    console.log(`   Sparse: ${participantIdIndex.sparse}`);
    console.log(`   Unique: ${participantIdIndex.unique}`);

    // Check for admin user
    const adminExists = await usersCollection.findOne({ email: 'admin@acgcet.edu' });
    
    if (adminExists) {
      console.log('\n✅ Admin user already exists!');
      console.log('═══════════════════════════════════════');
      console.log('📧 Email:    admin@acgcet.edu');
      console.log('🔑 Password: Admin@123');
      console.log('═══════════════════════════════════════');
    } else {
      console.log('\nℹ️  Admin user does not exist.');
      console.log('   Run: node create-admin.js to create it');
    }

    console.log('\n✅ Database indexes fixed successfully!');
    
    await mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
};

fixDatabaseIndexes();
