const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send email
exports.sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const message = {
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
      to: options.email,
      subject: options.subject,
      html: options.message
    };

    const info = await transporter.sendMail(message);
    console.log('Email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Email send error:', error);
    throw error;
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
