const nodemailer = require('nodemailer');

// Create transporter with proper error handling
const createTransporter = () => {
  try {
    // Check if email is configured
    const emailUser = process.env.EMAIL_USERNAME || process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASSWORD;
    
    if (!emailUser || !emailPass) {
      console.log('ℹ️  Email not configured - email sending is disabled');
      console.log('   To enable: Set EMAIL_USERNAME and EMAIL_PASSWORD in .env');
      return null;
    }

    // Gmail configuration
    if (process.env.EMAIL_SERVICE === 'gmail') {
      console.log('📧 Email configured: Gmail service');
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: emailUser,
          pass: emailPass
        }
      });
    }

    // Generic SMTP configuration
    const smtpHost = process.env.EMAIL_HOST || process.env.SMTP_HOST;
    const smtpPort = process.env.EMAIL_PORT || process.env.SMTP_PORT || 587;
    
    if (!smtpHost) {
      console.log('ℹ️  SMTP host not configured - email sending is disabled');
      return null;
    }

    console.log(`📧 Email configured: SMTP (${smtpHost}:${smtpPort})`);
    return nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort),
      secure: parseInt(smtpPort) === 465,
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });
  } catch (error) {
    console.error('❌ Email transporter creation failed:', error.message);
    return null;
  }
};

// Email templates
const emailTemplates = {
  'registration-pending': (context) => ({
    subject: 'Registration Received - SHACKLES 2025 🎉',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: #f4f4f4; }
          .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #E31B6C 0%, #FF3385 100%); color: white; padding: 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; }
          .content { padding: 30px; }
          .info-box { background: #f8f9fa; padding: 20px; border-left: 4px solid #E31B6C; margin: 20px 0; border-radius: 5px; }
          .info-box strong { color: #E31B6C; }
          .button { display: inline-block; padding: 12px 30px; background: #00D7A1; color: white; text-decoration: none; border-radius: 25px; margin: 20px 0; font-weight: bold; }
          .footer { background: #2a2a2a; color: #aaa; padding: 20px; text-align: center; font-size: 12px; }
          .emoji { font-size: 24px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 SHACKLES 2025</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">National Level Technical & Non-Technical Symposium</p>
          </div>
          <div class="content">
            <h2>Hello ${context.name}! 👋</h2>
            <p>Thank you for registering for <strong>SHACKLES 2025</strong>!</p>
            
            <div class="info-box">
              <p><strong>📋 Registration Type:</strong> ${context.registrationType?.toUpperCase()}</p>
              <p><strong>💰 Amount Paid:</strong> ₹${context.amount}</p>
              <p><strong>🔖 Transaction ID:</strong> ${context.transactionId}</p>
            </div>

            <p><strong>⏳ What's Next?</strong></p>
            <p>Your payment is currently under verification by our admin team. You will receive another email with your:</p>
            <ul>
              <li>✅ Unique Participant ID</li>
              <li>📱 QR Code for entry</li>
              <li>📧 Login credentials to access your profile</li>
            </ul>

            <p style="background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; border-radius: 5px;">
              <strong>⚠️ Important:</strong> Verification typically takes 24-48 hours. Please check your email regularly.
            </p>

            <p style="margin-top: 30px;">If you have any questions, feel free to contact us!</p>
          </div>
          <div class="footer">
            <p><strong>SHACKLES 2025</strong></p>
            <p>Department of Mechanical Engineering</p>
            <p>Alagappa Chettiar Government College of Engineering and Technology, Karaikudi</p>
            <p style="margin-top: 15px;">📧 Email: shackles@acgcet.ac.in | 📞 Contact: +91 XXXXX XXXXX</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  'payment-verified': (context) => ({
    subject: '✅ Payment Verified - Welcome to SHACKLES 2025!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: #f4f4f4; }
          .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #00D7A1 0%, #00FFC8 100%); color: white; padding: 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; }
          .content { padding: 30px; }
          .success-box { background: #d4edda; padding: 20px; border-left: 4px solid #28a745; margin: 20px 0; border-radius: 5px; text-align: center; }
          .info-box { background: #f8f9fa; padding: 20px; border-left: 4px solid #00D7A1; margin: 20px 0; border-radius: 5px; }
          .participant-id { font-size: 32px; font-weight: bold; color: #00D7A1; letter-spacing: 2px; }
          .button { display: inline-block; padding: 12px 30px; background: #E31B6C; color: white; text-decoration: none; border-radius: 25px; margin: 20px 0; font-weight: bold; }
          .footer { background: #2a2a2a; color: #aaa; padding: 20px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ PAYMENT VERIFIED!</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px;">Welcome to SHACKLES 2025</p>
          </div>
          <div class="content">
            <h2>Congratulations ${context.name}! 🎉</h2>
            <p>Your payment has been <strong>successfully verified</strong>. You're all set for SHACKLES 2025!</p>
            
            <div class="success-box">
              <p style="margin: 0; font-size: 14px; opacity: 0.8;">Your Participant ID</p>
              <p class="participant-id">${context.participantId}</p>
              <p style="margin: 0; font-size: 12px; opacity: 0.7;">Keep this ID safe!</p>
            </div>

            <div class="info-box">
              <p><strong>📋 Registration Details:</strong></p>
              <p><strong>Type:</strong> ${context.registrationType?.toUpperCase()}</p>
              <p><strong>Amount:</strong> ₹${context.amount}</p>
              <p><strong>Transaction ID:</strong> ${context.transactionId}</p>
              ${context.verificationNotes ? `<p><strong>Admin Notes:</strong> ${context.verificationNotes}</p>` : ''}
            </div>

            <p><strong>📱 Your QR Code:</strong></p>
            <p>Your unique QR code has been generated and is available in your profile. This QR code will be used for:</p>
            <ul>
              <li>✅ Entry verification at the venue</li>
              <li>✅ Event attendance marking</li>
              <li>✅ Certificate distribution</li>
            </ul>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" class="button">
                🚀 Access Your Profile
              </a>
            </div>

            <div style="background: #e7f3ff; padding: 15px; border-left: 4px solid #2196f3; border-radius: 5px; margin-top: 20px;">
              <p style="margin: 0;"><strong>📅 Event Details:</strong></p>
              <p style="margin: 5px 0;">Date: <strong>October 23-24, 2025</strong></p>
              <p style="margin: 5px 0;">Venue: <strong>ACGCET, Karaikudi</strong></p>
              <p style="margin: 5px 0;">Reporting Time: <strong>9:00 AM, October 23</strong></p>
            </div>

            <p style="margin-top: 20px;">See you at SHACKLES 2025! 🎊</p>
          </div>
          <div class="footer">
            <p><strong>SHACKLES 2025</strong> - Department of Mechanical Engineering</p>
            <p>ACGCET, Karaikudi</p>
            <p style="margin-top: 15px;">📧 shackles@acgcet.ac.in</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  'payment-rejected': (context) => ({
    subject: '⚠️ Payment Verification Issue - SHACKLES 2025',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: #f4f4f4; }
          .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .warning-box { background: #fff3cd; padding: 20px; border-left: 4px solid #ffc107; margin: 20px 0; border-radius: 5px; }
          .info-box { background: #f8f9fa; padding: 20px; border-left: 4px solid #dc3545; margin: 20px 0; border-radius: 5px; }
          .button { display: inline-block; padding: 12px 30px; background: #00D7A1; color: white; text-decoration: none; border-radius: 25px; margin: 20px 0; font-weight: bold; }
          .footer { background: #2a2a2a; color: #aaa; padding: 20px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚠️ PAYMENT VERIFICATION ISSUE</h1>
          </div>
          <div class="content">
            <h2>Hello ${context.name},</h2>
            <p>We regret to inform you that your payment verification for SHACKLES 2025 could not be completed.</p>
            
            <div class="info-box">
              <p><strong>Reason:</strong></p>
              <p style="font-size: 16px;">${context.reason || 'Payment verification failed'}</p>
            </div>

            <div class="warning-box">
              <p><strong>🔄 What You Need to Do:</strong></p>
              <ol>
                <li>Review the reason mentioned above</li>
                <li>Ensure your payment screenshot is clear and readable</li>
                <li>Verify your transaction ID matches your bank statement</li>
                <li>Resubmit your payment details through your profile</li>
              </ol>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" class="button">
                🔄 Resubmit Payment Details
              </a>
            </div>

            <p style="background: #e7f3ff; padding: 15px; border-left: 4px solid #2196f3; border-radius: 5px;">
              <strong>💡 Need Help?</strong><br>
              If you believe this is an error or need assistance, please contact our support team with your transaction details.
            </p>

            <p style="margin-top: 20px;">We apologize for any inconvenience and look forward to welcoming you at SHACKLES 2025!</p>
          </div>
          <div class="footer">
            <p><strong>SHACKLES 2025</strong> - Support Team</p>
            <p>📧 shackles@acgcet.ac.in | 📞 Contact: +91 XXXXX XXXXX</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  'password-reset': (context) => ({
    subject: '🔒 Password Reset Request - SHACKLES 2025',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: #f4f4f4; }
          .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .button { display: inline-block; padding: 15px 40px; background: #667eea; color: white; text-decoration: none; border-radius: 25px; margin: 20px 0; font-weight: bold; font-size: 16px; }
          .warning-box { background: #fff3cd; padding: 20px; border-left: 4px solid #ffc107; margin: 20px 0; border-radius: 5px; }
          .footer { background: #2a2a2a; color: #aaa; padding: 20px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔒 PASSWORD RESET</h1>
          </div>
          <div class="content">
            <h2>Hello ${context.name},</h2>
            <p>You requested to reset your password for your SHACKLES 2025 account.</p>
            <p>Click the button below to reset your password:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${context.resetUrl}" class="button">
                🔑 Reset My Password
              </a>
            </div>

            <p style="font-size: 14px; color: #666; text-align: center;">
              Or copy and paste this link into your browser:<br>
              <span style="word-break: break-all; font-size: 12px;">${context.resetUrl}</span>
            </p>

            <div class="warning-box">
              <p style="margin: 0;"><strong>⚠️ Important Security Information:</strong></p>
              <ul style="margin: 10px 0;">
                <li>This link will <strong>expire in 10 minutes</strong></li>
                <li>If you didn't request this, please ignore this email</li>
                <li>Your password will not change unless you click the link above</li>
                <li>Never share this link with anyone</li>
              </ul>
            </div>

            <p style="margin-top: 20px; font-size: 14px; color: #666;">
              If you're having trouble, contact our support team for assistance.
            </p>
          </div>
          <div class="footer">
            <p><strong>SHACKLES 2025</strong> - Security Team</p>
            <p>📧 shackles@acgcet.ac.in</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  'bulk': (context) => ({
    subject: context.subject || 'Important Announcement - SHACKLES 2025',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: #f4f4f4; }
          .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #E31B6C 0%, #FF3385 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .message-box { background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .footer { background: #2a2a2a; color: #aaa; padding: 20px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📢 ANNOUNCEMENT</h1>
            <p style="margin: 10px 0 0 0;">SHACKLES 2025</p>
          </div>
          <div class="content">
            <h2>Hello ${context.name},</h2>
            <div class="message-box">
              ${context.message}
            </div>
            <p style="margin-top: 20px;">Thank you for being part of SHACKLES 2025!</p>
          </div>
          <div class="footer">
            <p><strong>SHACKLES 2025</strong></p>
            <p>ACGCET, Karaikudi</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

// Main send email function with template support
exports.sendEmail = async (options) => {
  try {
    const transporter = createTransporter();
    
    // If email is not configured, skip sending but don't fail
    if (!transporter) {
      console.log('ℹ️  Email not configured - skipping email to:', options.to || options.email);
      return { skipped: true, message: 'Email service not configured' };
    }

    // Support both old and new parameter formats
    const recipientEmail = options.to || options.email;
    let subject = options.subject;
    let htmlContent = options.message || options.html;

    // If template is specified, use it
    if (options.template && emailTemplates[options.template]) {
      const template = emailTemplates[options.template](options.context || {});
      subject = options.subject || template.subject;
      htmlContent = template.html;
    }

    // Validate required fields
    if (!recipientEmail) {
      console.error('❌ Email send failed: No recipient specified');
      return { error: 'No recipient email address' };
    }

    if (!subject || !htmlContent) {
      console.error('❌ Email send failed: Missing subject or content');
      return { error: 'Missing email subject or content' };
    }

    // Prepare email message
    const emailFrom = process.env.EMAIL_FROM || process.env.EMAIL_USERNAME || process.env.EMAIL_USER;
    const emailFromName = process.env.EMAIL_FROM_NAME || 'SHACKLES 2025';

    const message = {
      from: `${emailFromName} <${emailFrom}>`,
      to: recipientEmail,
      subject: subject,
      html: htmlContent
    };

    // Send email
    const info = await transporter.sendMail(message);
    console.log(`✅ Email sent successfully to ${recipientEmail}:`, info.messageId);
    
    return { 
      success: true, 
      messageId: info.messageId,
      recipient: recipientEmail
    };
  } catch (error) {
    console.error('❌ Email send error:', error.message);
    console.error('   Recipient:', options.to || options.email);
    console.error('   Template:', options.template || 'custom');
    
    // Don't throw error - just log it so registration/operations can continue
    return { 
      error: error.message,
      recipient: options.to || options.email
    };
  }
};

// Welcome email template
exports.sendWelcomeEmail = async (user) => {
  const message = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f4f4f4; }
        .button { display: inline-block; padding: 10px 30px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to SHACKLES 2025</h1>
        </div>
        <div class="content">
          <h2>Hello ${user.name},</h2>
          <p>Thank you for registering for SHACKLES 2025 - National Level Technical & Non-Technical Symposium!</p>
          <p>Your account has been successfully created. You can now:</p>
          <ul>
            <li>Browse and register for events</li>
            <li>Participate in workshops</li>
            <li>Track your registrations</li>
            <li>Download tickets</li>
          </ul>
          <p>We're excited to have you join us for this amazing event!</p>
          <a href="${process.env.FRONTEND_URL}/events" class="button">Explore Events</a>
        </div>
        <div class="footer">
          <p>Department of Mechanical Engineering</p>
          <p>Parisutham Institute of Technology and Science</p>
          <p>If you have any questions, contact us at shackles@pits.edu.in</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await exports.sendEmail({
    email: user.email,
    subject: 'Welcome to SHACKLES 2025!',
    message
  });
};

// Payment success email
exports.sendPaymentSuccessEmail = async (user, registration, payment) => {
  const message = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10B981; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f4f4f4; }
        .details { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #10B981; }
        .button { display: inline-block; padding: 10px 30px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✓ Payment Successful!</h1>
        </div>
        <div class="content">
          <h2>Hello ${user.name},</h2>
          <p>Your payment has been successfully processed!</p>
          
          <div class="details">
            <h3>Payment Details:</h3>
            <p><strong>Transaction ID:</strong> ${payment.transactionId}</p>
            <p><strong>Amount Paid:</strong> ₹${payment.amount}</p>
            <p><strong>Payment Method:</strong> ${payment.method}</p>
            <p><strong>Date:</strong> ${new Date(payment.paidAt).toLocaleDateString()}</p>
          </div>

          <div class="details">
            <h3>Registration Details:</h3>
            <p><strong>Registration Number:</strong> ${registration.registrationNumber}</p>
            <p><strong>Event:</strong> ${registration.event?.name}</p>
            <p><strong>Status:</strong> Confirmed</p>
          </div>

          <p>You can download your ticket from your dashboard.</p>
          <a href="${process.env.FRONTEND_URL}/profile" class="button">Download Ticket</a>
        </div>
        <div class="footer">
          <p>SHACKLES 2025 - Parisutham Institute of Technology and Science</p>
          <p>Contact: shackles@pits.edu.in</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await exports.sendEmail({
    email: user.email,
    subject: 'Payment Successful - SHACKLES 2025',
    message
  });
};

// Password reset email
exports.sendPasswordResetEmail = async (user, resetUrl) => {
  const message = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #EF4444; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f4f4f4; }
        .button { display: inline-block; padding: 10px 30px; background: #EF4444; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .warning { background: #FEF2F2; border-left: 4px solid #EF4444; padding: 15px; margin: 15px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <h2>Hello ${user.name},</h2>
          <p>You are receiving this email because you (or someone else) has requested a password reset for your account.</p>
          <p>Please click the button below to reset your password:</p>
          <a href="${resetUrl}" class="button">Reset Password</a>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all;">${resetUrl}</p>
          
          <div class="warning">
            <strong>⚠ Important:</strong>
            <ul>
              <li>This link will expire in 10 minutes</li>
              <li>If you didn't request this, please ignore this email</li>
              <li>Your password will not change unless you click the link above</li>
            </ul>
          </div>
        </div>
        <div class="footer">
          <p>SHACKLES 2025 Security Team</p>
          <p>If you need assistance, contact: support@pits.edu.in</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await exports.sendEmail({
    email: user.email,
    subject: 'Password Reset Request - SHACKLES 2025',
    message
  });
};

// Bulk email
exports.sendBulkEmail = async (recipients, subject, htmlContent) => {
  try {
    const transporter = createTransporter();

    const promises = recipients.map(email => {
      return transporter.sendMail({
        from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: subject,
        html: htmlContent
      });
    });

    const results = await Promise.allSettled(promises);
    
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    return {
      total: recipients.length,
      successful,
      failed,
      results
    };
  } catch (error) {
    console.error('Bulk email error:', error);
    throw error;
  }
};
