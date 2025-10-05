require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('Testing email configuration...');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '***' + process.env.EMAIL_PASSWORD.slice(-4) : 'NOT SET');

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Test the connection
transporter.verify(function(error, success) {
  if (error) {
    console.log('❌ Email configuration error:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Make sure 2-Step Verification is enabled on your Google account');
    console.log('2. Generate a new App Password at: https://myaccount.google.com/apppasswords');
    console.log('3. Update EMAIL_PASSWORD in .env file (remove all spaces)');
    console.log('4. Restart the server');
  } else {
    console.log('✅ Email server is ready to send messages!');
    console.log('Sending test email...');
    
    // Send a test email
    transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_USER,
      subject: '✅ SHACKLES Email Test Successful!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0ad7a1;">Email Configuration Successful! 🎉</h1>
          <p>Your SHACKLES backend email system is now working correctly.</p>
          <p>Registration confirmation emails will be sent automatically.</p>
          <p><strong>Test Date:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `
    }, (err, info) => {
      if (err) {
        console.log('❌ Failed to send test email:', err.message);
      } else {
        console.log('✅ Test email sent successfully!');
        console.log('📧 Check your inbox:', process.env.EMAIL_USER);
      }
      process.exit(0);
    });
  }
});
