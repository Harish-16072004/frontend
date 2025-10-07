const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { sendEmail } = require('./src/utils/emailService');

async function testEmailConfig() {
  console.log('🧪 Testing Email Configuration...\n');
  console.log('='.repeat(60));
  
  // Test configuration
  console.log('\n📋 Current Configuration:\n');
  const emailUser = process.env.EMAIL_USERNAME || process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASSWORD;
  
  console.log('  EMAIL_SERVICE:', process.env.EMAIL_SERVICE || '❌ NOT SET');
  console.log('  EMAIL_HOST:', process.env.EMAIL_HOST || '❌ NOT SET');
  console.log('  EMAIL_PORT:', process.env.EMAIL_PORT || '❌ NOT SET');
  console.log('  EMAIL_USERNAME:', emailUser ? '✅ Set (' + emailUser + ')' : '❌ Not set');
  console.log('  EMAIL_PASSWORD:', emailPass ? '✅ Set (length: ' + emailPass.length + ' chars)' : '❌ Not set');
  console.log('  EMAIL_FROM:', process.env.EMAIL_FROM || emailUser || '❌ NOT SET');
  console.log('  EMAIL_FROM_NAME:', process.env.EMAIL_FROM_NAME || 'SHACKLES 2025 (default)');
  
  console.log('\n' + '='.repeat(60));
  
  if (!emailUser || !emailPass) {
    console.log('\n⚠️  EMAIL IS NOT CONFIGURED!\n');
    console.log('To enable email sending:');
    console.log('1. Open backend/.env file');
    console.log('2. Set EMAIL_USERNAME and EMAIL_PASSWORD');
    console.log('3. Get Gmail App Password from: https://myaccount.google.com/apppasswords');
    console.log('4. Run this test again\n');
    console.log('='.repeat(60));
    return;
  }

  // Check for common issues
  if (emailPass.includes(' ')) {
    console.log('\n⚠️  WARNING: EMAIL_PASSWORD contains spaces!');
    console.log('   This will cause authentication to fail.');
    console.log('   Remove all spaces from the password in .env file\n');
  }

  if (emailPass.length !== 16) {
    console.log('\n⚠️  WARNING: Gmail App Password should be exactly 16 characters');
    console.log(`   Current length: ${emailPass.length} characters`);
    console.log('   Generate a new one if this fails\n');
  }

  // Get recipient email
  const testRecipient = process.argv[2] || emailUser;
  
  console.log('\n📧 Sending test email...\n');
  console.log(`  To: ${testRecipient}`);
  console.log('  Template: registration-pending (sample)');
  console.log('  Please wait...\n');
  
  // Test email with registration template
  const result = await sendEmail({
    to: testRecipient,
    template: 'registration-pending',
    context: {
      name: 'Test User',
      registrationType: 'both',
      amount: 499,
      transactionId: 'TEST123456789'
    }
  });

  console.log('='.repeat(60));
  console.log('\n📊 Test Result:\n');

  if (result.success) {
    console.log('✅ SUCCESS! Email sent successfully!\n');
    console.log('  Message ID:', result.messageId);
    console.log('  Recipient:', result.recipient);
    console.log('\n💡 Action Required:');
    console.log('  1. Check your inbox:', testRecipient);
    console.log('  2. Look for: "Registration Received - SHACKLES 2025"');
    console.log('  3. Check spam folder if not in inbox');
    console.log('\n🎉 Email system is working correctly!');
  } else if (result.skipped) {
    console.log('⚠️  Email service is not configured\n');
    console.log('  Reason:', result.message);
    console.log('\n💡 Check your .env file');
  } else {
    console.log('❌ FAILED! Email could not be sent\n');
    console.log('  Error:', result.error);
    console.log('\n💡 Common Issues & Solutions:');
    console.log('  1. Wrong App Password');
    console.log('     → Generate new one at: https://myaccount.google.com/apppasswords');
    console.log('  2. Spaces in password');
    console.log('     → Remove all spaces from EMAIL_PASSWORD in .env');
    console.log('  3. 2-Step Verification not enabled');
    console.log('     → Enable at: https://myaccount.google.com/security');
    console.log('  4. Firewall blocking SMTP');
    console.log('     → Check your antivirus/firewall settings');
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n📚 Next Steps:');
  console.log('  • Test all templates: node test-email-all-templates.js');
  console.log('  • Read guide: EMAIL_SETUP_GUIDE.md');
  console.log('  • Start backend: npm run dev');
  console.log('\n');
}

// Handle errors
testEmailConfig()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('\n❌ Test failed with error:\n');
    console.error(err);
    console.error('\n💡 Check your email configuration in .env file');
    process.exit(1);
  });
