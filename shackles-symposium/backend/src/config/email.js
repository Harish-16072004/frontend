const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  // Default SMTP configuration
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });
};

// Email templates
const emailTemplates = {
  welcome: (name) => ({
    subject: 'Welcome to SHACKLES 25-26! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #d32f2f;">Welcome to SHACKLES 25-26!</h1>
        <p>Dear ${name},</p>
        <p>Thank you for registering for SHACKLES 25-26, the flagship symposium of the Mechanical Engineering Association, ACGCET.</p>
        <p>We're excited to have you join us for this incredible event!</p>
        <p>Best regards,<br>SHACKLES Team</p>
      </div>
    `
  }),

  registrationConfirmation: (name, regNumber, eventName) => ({
    subject: `Registration Confirmed - ${eventName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d32f2f;">Registration Confirmed! ✅</h2>
        <p>Dear ${name},</p>
        <p>Your registration for <strong>${eventName}</strong> has been confirmed.</p>
        <p><strong>Registration Number:</strong> ${regNumber}</p>
        <p>Please keep this registration number safe for future reference.</p>
        <p>Best regards,<br>SHACKLES Team</p>
      </div>
    `
  }),

  paymentSuccess: (name, amount, transactionId) => ({
    subject: 'Payment Successful - SHACKLES 25-26',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4caf50;">Payment Successful! 💳</h2>
        <p>Dear ${name},</p>
        <p>Your payment of ₹${amount} has been successfully processed.</p>
        <p><strong>Transaction ID:</strong> ${transactionId}</p>
        <p>Thank you for your payment!</p>
        <p>Best regards,<br>SHACKLES Team</p>
      </div>
    `
  }),

  resetPassword: (name, resetLink) => ({
    subject: 'Password Reset Request - SHACKLES 25-26',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d32f2f;">Password Reset Request</h2>
        <p>Dear ${name},</p>
        <p>You requested to reset your password. Click the link below to proceed:</p>
        <p><a href="${resetLink}" style="background-color: #d32f2f; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>SHACKLES Team</p>
      </div>
    `
  }),

  eventReminder: (name, eventName, eventDate, eventTime) => ({
    subject: `Reminder: ${eventName} - Tomorrow!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d32f2f;">Event Reminder 📅</h2>
        <p>Dear ${name},</p>
        <p>This is a reminder that <strong>${eventName}</strong> is scheduled for tomorrow!</p>
        <p><strong>Date:</strong> ${eventDate}</p>
        <p><strong>Time:</strong> ${eventTime}</p>
        <p>We look forward to seeing you there!</p>
        <p>Best regards,<br>SHACKLES Team</p>
      </div>
    `
  })
};

module.exports = {
  createTransporter,
  emailTemplates
};
