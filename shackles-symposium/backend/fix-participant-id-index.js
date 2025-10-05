require('dotenv').config();
const mongoose = require('mongoose');

const fixParticipantIdIndex = async () => {
  try {
    console.log('🔧 Fixing participantId index issue...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Step 1: Show current indexes
    console.log('\n📋 Current Indexes:');
    const indexes = await usersCollection.indexes();
    indexes.forEach(index => {
      console.log(`  - Name: ${index.name}`);
      console.log(`    Keys: ${JSON.stringify(index.key)}`);
      console.log(`    Unique: ${index.unique || false}`);
      console.log(`    Sparse: ${index.sparse || false}`);
    });

    // Step 2: Drop the problematic index
    try {
      await usersCollection.dropIndex('participantId_1');
      console.log('\n✅ Dropped participantId_1 index');
    } catch (err) {
      console.log('\n⚠️  participantId_1 index does not exist');
    }

    // Step 3: Remove participantId field from all users who have null
    console.log('\n🔄 Removing null participantId fields...');
    const updateResult = await usersCollection.updateMany(
      { participantId: null },
      { $unset: { participantId: "" } }
    );
    console.log(`   Updated ${updateResult.modifiedCount} documents`);

    // Also remove undefined values
    const updateResult2 = await usersCollection.updateMany(
      { participantId: { $exists: true, $eq: null } },
      { $unset: { participantId: "" } }
    );
    console.log(`   Cleaned ${updateResult2.modifiedCount} more documents`);

    // Step 4: Create the proper sparse unique index
    console.log('\n📊 Creating new sparse unique index...');
    await usersCollection.createIndex(
      { participantId: 1 },
      { 
        unique: true, 
        sparse: true,
        name: 'participantId_1'
      }
    );
    console.log('✅ Created participantId_1 index (unique + sparse)');

    // Step 5: Verify the new index
    console.log('\n🔍 Verifying new index...');
    const newIndexes = await usersCollection.indexes();
    const participantIdIndex = newIndexes.find(idx => idx.name === 'participantId_1');
    
    if (participantIdIndex) {
      console.log('✅ Index verified:');
      console.log(`   Name: ${participantIdIndex.name}`);
      console.log(`   Unique: ${participantIdIndex.unique}`);
      console.log(`   Sparse: ${participantIdIndex.sparse}`);
    }

    // Step 6: Show statistics
    console.log('\n📊 User Statistics:');
    const totalUsers = await usersCollection.countDocuments();
    const usersWithId = await usersCollection.countDocuments({ 
      participantId: { $exists: true, $ne: null } 
    });
    const usersWithoutId = totalUsers - usersWithId;

    console.log(`   Total Users: ${totalUsers}`);
    console.log(`   With Participant ID: ${usersWithId}`);
    console.log(`   Without Participant ID: ${usersWithoutId}`);

    // Step 7: List users with participant IDs
    if (usersWithId > 0) {
      console.log('\n👥 Users with Participant IDs:');
      const usersWithIds = await usersCollection.find({ 
        participantId: { $exists: true, $ne: null } 
      })
        .project({ name: 1, email: 1, participantId: 1, registrationType: 1 })
        .toArray();
      
      usersWithIds.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.participantId} - ${user.name} (${user.email})`);
        console.log(`      Type: ${user.registrationType || 'N/A'}`);
      });
    }

    console.log('\n═══════════════════════════════════════');
    console.log('✅ INDEX FIXED SUCCESSFULLY!');
    console.log('═══════════════════════════════════════');
    console.log('\n🎉 You can now create users and verify payments!');
    console.log('   - New users will not have participantId field');
    console.log('   - participantId will be added only on payment verification');
    console.log('   - The sparse index allows multiple users without participantId');

    await mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
};

fixParticipantIdIndex();
