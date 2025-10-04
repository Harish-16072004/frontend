const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    console.log('📍 Connection String:', mongoUri ? 'Found in .env' : '❌ NOT FOUND in .env');
    
    if (!mongoUri) {
      console.error('\n❌ MONGODB_URI not found in .env file!');
      console.log('\n📝 Please update server/.env file with:');
      console.log('MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shackles_db?retryWrites=true&w=majority\n');
      console.log('⚠️  Make sure to:');
      console.log('   1. Replace <db_password> with your actual password');
      console.log('   2. Add database name (e.g., /shackles_db)');
      console.log('   3. Add connection options (?retryWrites=true&w=majority)\n');
      process.exit(1);
    }

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('\n✅ MongoDB Atlas connected successfully!\n');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    console.log('🌐 Host:', mongoose.connection.host);
    console.log('🔗 Connection State:', mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected');
    
    // List all collections
    console.log('\n📂 Checking collections...');
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log('   No collections yet (this is normal for new database)');
    } else {
      console.log('   Collections found:', collections.map(c => c.name).join(', '));
    }
    
    // Test write operation
    console.log('\n🧪 Testing write operation...');
    const testCollection = mongoose.connection.db.collection('connection_test');
    await testCollection.insertOne({ 
      test: true, 
      timestamp: new Date(),
      message: 'Connection test successful!' 
    });
    console.log('   ✅ Write test passed');
    
    // Test read operation
    console.log('\n📖 Testing read operation...');
    const testDoc = await testCollection.findOne({ test: true });
    console.log('   ✅ Read test passed:', testDoc.message);
    
    // Clean up test
    await testCollection.deleteOne({ test: true });
    console.log('   🧹 Cleaned up test data');
    
    await mongoose.connection.close();
    console.log('\n🔌 Connection closed successfully');
    console.log('\n✨ All tests passed! Your MongoDB Atlas is ready to use.\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Connection failed!\n');
    console.error('Error:', error.message);
    
    if (error.message.includes('authentication')) {
      console.log('\n💡 Tip: Check your username and password');
      console.log('💡 Tip: Encode special characters in password (@ → %40, # → %23)');
    } else if (error.message.includes('timeout')) {
      console.log('\n💡 Tip: Check Network Access in MongoDB Atlas');
      console.log('💡 Tip: Add 0.0.0.0/0 for development');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('\n💡 Tip: Check your connection string format');
      console.log('💡 Tip: Ensure cluster URL is correct');
    }
    
    console.log('\n📚 See MONGODB_ATLAS_SETUP.md for detailed troubleshooting\n');
    process.exit(1);
  }
};

console.log('\n═══════════════════════════════════════════════════');
console.log('   MongoDB Atlas Connection Test');
console.log('   SHACKLES 25-26 Symposium');
console.log('═══════════════════════════════════════════════════\n');

testConnection();
