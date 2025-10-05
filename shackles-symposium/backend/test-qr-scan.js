/**
 * Test QR Code Scanning and Access Control
 * 
 * This script demonstrates:
 * 1. QR code validation
 * 2. Access control based on registration type
 * 3. Event-specific access rules
 */

require('dotenv').config();
const mongoose = require('mongoose');
const colors = require('colors');
const { validateQRScan, checkEventAccess } = require('./src/utils/qrScanner');

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected'.green.bold);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:'.red, error.message);
    process.exit(1);
  }
};

// Test scenarios
const testAccessControl = async () => {
  console.log('\n' + '='.repeat(60));
  console.log('🧪 TESTING QR SCANNING & ACCESS CONTROL'.cyan.bold);
  console.log('='.repeat(60) + '\n');
  
  // Test Case 1: Workshop registration trying to access general event
  console.log('Test Case 1: Workshop Registration → General Event'.yellow.bold);
  console.log('-'.repeat(60));
  
  const test1 = await checkEventAccess('workshop', 'technical');
  console.log('Registration Type: workshop');
  console.log('Event Category: technical (general event)');
  console.log('Access Allowed:', test1.allowed ? '✅ YES'.green : '❌ NO'.red);
  if (!test1.allowed) {
    console.log('Message:'.red, test1.message);
  }
  console.log('');
  
  // Test Case 2: General registration trying to access workshop
  console.log('Test Case 2: General Registration → Workshop'.yellow.bold);
  console.log('-'.repeat(60));
  
  const test2 = await checkEventAccess('general', 'workshop');
  console.log('Registration Type: general');
  console.log('Event Category: workshop');
  console.log('Access Allowed:', test2.allowed ? '✅ YES'.green : '❌ NO'.red);
  if (!test2.allowed) {
    console.log('Message:'.red, test2.message);
  }
  console.log('');
  
  // Test Case 3: Both registration accessing general event
  console.log('Test Case 3: Both Registration → General Event'.yellow.bold);
  console.log('-'.repeat(60));
  
  const test3 = await checkEventAccess('both', 'technical');
  console.log('Registration Type: both');
  console.log('Event Category: technical');
  console.log('Access Allowed:', test3.allowed ? '✅ YES'.green : '❌ NO'.red);
  if (test3.allowed) {
    console.log('Message:'.green, test3.message);
  }
  console.log('');
  
  // Test Case 4: Both registration accessing workshop
  console.log('Test Case 4: Both Registration → Workshop'.yellow.bold);
  console.log('-'.repeat(60));
  
  const test4 = await checkEventAccess('both', 'workshop');
  console.log('Registration Type: both');
  console.log('Event Category: workshop');
  console.log('Access Allowed:', test4.allowed ? '✅ YES'.green : '❌ NO'.red);
  if (test4.allowed) {
    console.log('Message:'.green, test4.message);
  }
  console.log('');
  
  // Test Case 5: Workshop registration accessing paper presentation (general event)
  console.log('Test Case 5: Workshop Registration → Paper Presentation'.yellow.bold);
  console.log('-'.repeat(60));
  
  const test5 = await checkEventAccess('workshop', 'technical');
  console.log('Registration Type: workshop');
  console.log('Event: Paper Presentation (technical)');
  console.log('Access Allowed:', test5.allowed ? '✅ YES'.green : '❌ NO'.red);
  if (!test5.allowed) {
    console.log('Message:'.red, test5.message);
  }
  console.log('');
  
  // Test Case 6: General registration accessing CAD Modelling (general event)
  console.log('Test Case 6: General Registration → CAD Modelling'.yellow.bold);
  console.log('-'.repeat(60));
  
  const test6 = await checkEventAccess('general', 'technical');
  console.log('Registration Type: general');
  console.log('Event: CAD Modelling (technical)');
  console.log('Access Allowed:', test6.allowed ? '✅ YES'.green : '❌ NO'.red);
  if (test6.allowed) {
    console.log('Message:'.green, test6.message);
  }
  console.log('');
  
  console.log('='.repeat(60));
  console.log('✅ Access Control Tests Completed'.green.bold);
  console.log('='.repeat(60) + '\n');
};

// Test QR validation with real participant
const testQRValidation = async () => {
  console.log('\n' + '='.repeat(60));
  console.log('🔍 TESTING QR VALIDATION WITH REAL DATA'.cyan.bold);
  console.log('='.repeat(60) + '\n');
  
  const User = require('./src/models/User');
  const Event = require('./src/models/Event');
  
  // Find a verified user
  const user = await User.findOne({ 
    paymentStatus: 'verified',
    participantId: { $exists: true }
  }).select('participantId name email registrationType');
  
  if (!user) {
    console.log('⚠️  No verified users found in database'.yellow);
    console.log('Please verify a payment first to test QR validation\n');
    return;
  }
  
  console.log('Found User:'.green);
  console.log('  Participant ID:', user.participantId);
  console.log('  Name:', user.name);
  console.log('  Registration Type:', user.registrationType);
  console.log('');
  
  // Create sample QR data
  const qrData = JSON.stringify({
    participantId: user.participantId,
    name: user.name,
    email: user.email,
    registrationType: user.registrationType,
    generatedAt: new Date().toISOString(),
    eventName: 'SHACKLES 2025'
  });
  
  console.log('QR Code Data:'.cyan);
  console.log(qrData);
  console.log('');
  
  // Find an event to test
  const event = await Event.findOne().select('_id name category');
  
  if (!event) {
    console.log('⚠️  No events found in database'.yellow);
    console.log('Please create an event first to test validation\n');
    return;
  }
  
  console.log('Testing Access to Event:'.cyan);
  console.log('  Event:', event.name);
  console.log('  Category:', event.category);
  console.log('');
  
  // Validate QR scan
  const validation = await validateQRScan(qrData, event._id.toString(), 'event');
  
  if (validation.success) {
    console.log('✅ QR VALIDATION SUCCESSFUL'.green.bold);
    console.log('  Participant:', validation.participant.name);
    console.log('  Event:', validation.event.name);
    console.log('  Access Granted:', validation.accessGranted ? '✅ YES'.green : '❌ NO'.red);
  } else {
    console.log('❌ QR VALIDATION FAILED'.red.bold);
    console.log('  Error:', validation.error);
    console.log('  Message:', validation.message);
    
    if (validation.step === 'ACCESS_CONTROL') {
      console.log('');
      console.log('Access Denied Details:'.yellow);
      console.log('  Registration Type:', validation.participant.registrationType);
      console.log('  Event Category:', validation.event.category);
    }
  }
  
  console.log('');
  console.log('='.repeat(60));
  console.log('✅ QR Validation Test Completed'.green.bold);
  console.log('='.repeat(60) + '\n');
};

// Main test function
const runTests = async () => {
  try {
    await connectDB();
    
    // Test 1: Access control rules
    await testAccessControl();
    
    // Test 2: Real QR validation
    await testQRValidation();
    
    console.log('🎉 All tests completed!'.green.bold + '\n');
    
  } catch (error) {
    console.error('❌ Test Error:'.red, error.message);
    console.error(error);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Database connection closed'.gray);
    process.exit(0);
  }
};

// Run tests
runTests();
