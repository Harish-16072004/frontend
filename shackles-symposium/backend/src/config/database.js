const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () => {
  try {
    const options = {
      serverSelectionTimeoutMS: 30000, // Increased from 10s to 30s
      socketTimeoutMS: 75000, // Increased from 45s to 75s
      connectTimeoutMS: 30000, // Added connection timeout
      bufferCommands: false, // Disable buffering to prevent timeout errors
      family: 4, // Force IPv4
      maxPoolSize: 10,
      minPoolSize: 2,
      retryWrites: true,
      retryReads: true,
    };

    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
    console.log(`📊 Database: ${conn.connection.name}`.cyan);
    
    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err.message}`.red.bold);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected - attempting to reconnect...'.yellow);
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected'.green);
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination'.yellow);
      process.exit(0);
    });

    return conn;
  } catch (error) {
    console.error(`❌ Error: ${error.message}`.red.bold);
    console.error('💡 Possible solutions:'.yellow);
    console.error('   1. Check your internet connection'.yellow);
    console.error('   2. Verify MongoDB Atlas IP whitelist (add 0.0.0.0/0 for development)'.yellow);
    console.error('   3. Check if MongoDB URI is correct in .env file'.yellow);
    console.error('   4. Restart your router/check firewall settings'.yellow);
    process.exit(1);
  }
};

module.exports = connectDB;
