const path = require('dotenv').config({ path: path.join(__dirname, '.env') });
const { sendEmail } = require('./src/utils/emailService');

async function testAllTemplates() {
  console.log('🧪 Testing All Email Templates...\n');
  console.log('='.repeat(60));

  const testRecipient = process.argv[2] || process.env.EMAIL_USERNAME || process.env.EMAIL_USER;
  
  if (!testRecipient) {
    console.log('❌ No recipient email configured');
    console.log('Usage: node test-email-all-templates.js your-email@example.com');
    process.exit(1);
  }

  console.log(`📧 All test emails will be sent to: ${testRecipient}\n`);

  const tests = [
    {
      name: 'Registration Pending',
      template: 'registration-pending',
      context: {
        name: 'John Doe',
        registrationType: 'both',
        amount: 499,
        transactionId: 'TXN123456789'
      }
    },
    {
      name: 'Payment Verified',
      template: 'payment-verified',
      context: {
        name: 'John Doe',
        participantId: 'SHGN001',
        registrationType: 'both',
        amount: 499,
        transactionId: 'TXN123456789',
        verificationNotes: 'Payment verified successfully by admin'
      }
    },
    {
      name: 'Payment Rejected',
      template: 'payment-rejected',
      context: {
        name: 'John Doe',
        reason: 'Transaction ID does not match the screenshot. Please verify and resubmit.'
      }
    },
    {
      name: 'Password Reset',
      template: 'password-reset',
      context: {
        name: 'John Doe',
        resetUrl: 'http://localhost:3000/reset-password?token=abc123xyz456test'
      }
    },
    {
      name: 'Bulk/Announcement',
      template: 'bulk',
      context: {
        name: 'John Doe',
        message: `
          <p><strong>Important Announcement!</strong></p>
          <p>This is a sample announcement email sent to all participants.</p>
          <p>The event schedule has been updated. Please check your profile for the latest information.</p>
          <ul>
            <li>Event Date: October 23-24, 2025</li>
            <li>Venue: ACGCET, Karaikudi</li>
            <li>Reporting Time: 9:00 AM</li>
          </ul>
          <p>We look forward to seeing you!</p>
        `
      }
    }
  ];

  let successCount = 0;
  let failCount = 0;

  for (const test of tests) {
    console.log(`\n📧 Testing: ${test.name}`);
    console.log('-'.repeat(60));

    const result = await sendEmail({
      to: testRecipient,
      template: test.template,
      context: test.context
    });

    if (result.success) {
      console.log(`✅ ${test.name} - Sent successfully`);
      console.log(`   Message ID: ${result.messageId}`);
      successCount++;
    } else if (result.skipped) {
      console.log(`⚠️  ${test.name} - Skipped (email not configured)`);
    } else {
      console.log(`❌ ${test.name} - Failed`);
      console.log(`   Error: ${result.error}`);
      failCount++;
    }

    // Wait 2 seconds between emails to avoid rate limiting
    if (tests.indexOf(test) < tests.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Test Summary:\n');
  console.log(`  Total Tests: ${tests.length}`);
  console.log(`  ✅ Successful: ${successCount}`);
  console.log(`  ❌ Failed: ${failCount}`);
  console.log(`  ⚠️  Skipped: ${tests.length - successCount - failCount}`);
  console.log('\n💡 Check your inbox for all test emails!');
  console.log('   Don\'t forget to check the spam folder.\n');
  console.log('='.repeat(60));
}

testAllTemplates()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('\n❌ Test failed:', err);
    process.exit(1);
  });
