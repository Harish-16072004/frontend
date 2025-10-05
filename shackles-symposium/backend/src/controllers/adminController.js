const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Payment = require('../models/Payment');
const { exportToExcel } = require('../utils/excelGenerator');
const { exportToGoogleSheets } = require('../utils/googleSheets');
const { sendEmail } = require('../utils/emailService');
const { generateQR, generateParticipantQR, generateParticipantQRBase64 } = require('../utils/qrGenerator');
const { uploadToS3 } = require('../utils/s3Upload');
const { generateParticipantId } = require('../utils/idGenerator');

// @desc    Get dashboard statistics
// @route   GET /api/v1/admin/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    // Get counts
    const totalUsers = await User.countDocuments();
    const totalEvents = await Event.countDocuments({ isActive: true });
    const totalRegistrations = await Registration.countDocuments();
    const confirmedRegistrations = await Registration.countDocuments({ status: 'confirmed' });
    const pendingRegistrations = await Registration.countDocuments({ status: 'pending' });

    // Get payment stats
    const paymentStats = await Payment.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          total: { $sum: '$amount' }
        }
      }
    ]);

    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Recent registrations
    const recentRegistrations = await Registration.find()
      .populate('user', 'name email')
      .populate('event', 'name')
      .sort('-createdAt')
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        users: totalUsers,
        events: totalEvents,
        registrations: {
          total: totalRegistrations,
          confirmed: confirmedRegistrations,
          pending: pendingRegistrations
        },
        payments: paymentStats,
        revenue: totalRevenue[0]?.total || 0,
        recentRegistrations
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get analytics data
// @route   GET /api/v1/admin/analytics
// @access  Private/Admin
exports.getAnalytics = async (req, res) => {
  try {
    // Registrations by event
    const registrationsByEvent = await Registration.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: '$event',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'events',
          localField: '_id',
          foreignField: '_id',
          as: 'event'
        }
      },
      { $unwind: '$event' },
      {
        $project: {
          eventName: '$event.name',
          category: '$event.category',
          count: 1
        }
      }
    ]);

    // Registrations by date
    const registrationsByDate = await Registration.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // College-wise registrations
    const registrationsByCollege = await Registration.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $group: {
          _id: '$user.college',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        registrationsByEvent,
        registrationsByDate,
        registrationsByCollege
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all users
// @route   GET /api/v1/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: users.length,
      users: users,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all registrations
// @route   GET /api/v1/admin/registrations
// @access  Private/Admin
exports.getAllRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate('user', 'name email phone college')
      .populate('event', 'name category')
      .populate('workshop', 'title')
      .populate('payment')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all payments
// @route   GET /api/v1/admin/payments
// @access  Private/Admin
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('user', 'name email phone')
      .populate({
        path: 'registration',
        populate: { path: 'event workshop' }
      })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Verify payment manually
// @route   POST /api/v1/admin/payments/:id/verify
// @access  Private/Admin
exports.verifyPaymentManually = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    payment.status = 'success';
    payment.paidAt = Date.now();
    payment.verifiedBy = req.user.id;
    await payment.save();

    // Update registration
    await Registration.findByIdAndUpdate(payment.registration, {
      status: 'confirmed',
      payment: payment._id
    });

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Export data to Excel
// @route   POST /api/v1/admin/export/excel
// @access  Private/Admin
exports.exportDataToExcel = async (req, res) => {
  try {
    const { dataType, filters } = req.body;

    let data;
    switch (dataType) {
      case 'users':
        data = await User.find(filters || {}).select('-password').lean();
        break;
      case 'registrations':
        data = await Registration.find(filters || {})
          .populate('user', 'name email phone college')
          .populate('event', 'name category')
          .lean();
        break;
      case 'payments':
        data = await Payment.find(filters || {})
          .populate('user', 'name email')
          .lean();
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid data type'
        });
    }

    const buffer = await exportToExcel(data, dataType);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${dataType}-${Date.now()}.xlsx`);
    res.send(buffer);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Export data to Google Sheets
// @route   POST /api/v1/admin/export/google-sheets
// @access  Private/Admin
exports.exportDataToGoogleSheets = async (req, res) => {
  try {
    const { dataType, filters } = req.body;

    let data;
    switch (dataType) {
      case 'users':
        data = await User.find(filters || {}).select('-password').lean();
        break;
      case 'registrations':
        data = await Registration.find(filters || {})
          .populate('user', 'name email phone college')
          .populate('event', 'name category')
          .lean();
        break;
      case 'payments':
        data = await Payment.find(filters || {})
          .populate('user', 'name email')
          .lean();
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid data type'
        });
    }

    const sheetUrl = await exportToGoogleSheets(data, dataType);

    res.status(200).json({
      success: true,
      message: 'Data exported to Google Sheets successfully',
      data: { sheetUrl }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Send bulk email
// @route   POST /api/v1/admin/send-bulk-email
// @access  Private/Admin
exports.sendBulkEmail = async (req, res) => {
  try {
    const { recipients, subject, message, filters } = req.body;

    let users;
    if (recipients === 'all') {
      users = await User.find(filters || {}).select('email name');
    } else if (recipients === 'registered') {
      const registrations = await Registration.find({ status: 'confirmed' })
        .populate('user', 'email name')
        .distinct('user');
      users = registrations;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid recipient type'
      });
    }

    // Send emails
    const emailPromises = users.map(user =>
      sendEmail({
        to: user.email,
        subject,
        template: 'bulk',
        context: {
          name: user.name,
          message
        }
      })
    );

    await Promise.all(emailPromises);

    res.status(200).json({
      success: true,
      message: `Bulk email sent to ${users.length} recipients`
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// @desc    Get pending payment verifications
// @route   GET /api/v1/admin/registrations/pending-verification
// @access  Private/Admin
exports.getPendingVerifications = async (req, res) => {
  try {
    const pendingRegistrations = await Registration.find({
      verificationStatus: 'pending',
      paymentScreenshot: { $ne: null }
    })
      .populate('user', 'name email phone college department year')
      .populate('event', 'name category fees')
      .populate('workshop', 'title fees')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: pendingRegistrations.length,
      data: pendingRegistrations
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all users with pending payments (NEW - for direct registration model)
// @route   GET /api/v1/admin/payments/pending
// @access  Private/Admin
exports.getPendingPayments = async (req, res) => {
  try {
    const pendingUsers = await User.find({
      paymentStatus: 'pending',
      paymentScreenshot: { $exists: true, $ne: null }
    })
      .select('name email phone college department year collegeLocation registrationType paymentAmount transactionId paymentScreenshot paymentStatus createdAt')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: pendingUsers.length,
      data: pendingUsers
    });

  } catch (error) {
    console.error('❌ Error fetching pending payments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending payments',
      error: error.message
    });
  }
};

// @desc    Verify user payment
// @route   PUT /api/v1/admin/payments/:userId/verify
// @access  Private/Admin
exports.verifyPayment = async (req, res) => {
  try {
    const { userId } = req.params;
    const { notes } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already verified
    if (user.paymentStatus === 'verified' && user.participantId) {
      return res.status(400).json({
        success: false,
        message: 'Payment already verified and participant ID generated'
      });
    }

    // Generate unique participant ID
    const participantId = await generateParticipantId(user.registrationType);
    console.log(`✅ Generated participant ID: ${participantId} for ${user.email}`);

    // Generate QR code and upload to S3
    let qrCodeUrl = null;
    let qrCodeKey = null;
    let qrBase64 = null;

    try {
      const qrResult = await generateParticipantQR(participantId, {
        name: user.name,
        email: user.email,
        registrationType: user.registrationType
      });

      qrCodeUrl = qrResult.qrCodeUrl;
      qrCodeKey = qrResult.qrCodeKey;

      // Also generate base64 for email
      qrBase64 = await generateParticipantQRBase64(participantId, {
        name: user.name,
        email: user.email,
        registrationType: user.registrationType
      });

      console.log(`✅ QR code generated and uploaded to S3: ${qrCodeUrl}`);

    } catch (qrError) {
      console.error('❌ Failed to generate QR code:', qrError.message);
      // Don't fail the verification if QR generation fails
    }

    // Update user with all verification details
    user.paymentStatus = 'verified';
    user.verificationNotes = notes;
    user.verifiedAt = Date.now();
    user.verifiedBy = req.user._id; // Admin who verified
    user.participantId = participantId;
    user.qrCode = qrCodeUrl;
    user.qrCodeKey = qrCodeKey;

    await user.save();

    // Determine registration type label
    let regTypeLabel = '';
    switch (user.registrationType) {
      case 'both':
        regTypeLabel = 'General Events + Workshop';
        break;
      case 'general':
        regTypeLabel = 'General Events Only';
        break;
      case 'workshop':
        regTypeLabel = 'Workshop Only';
        break;
      default:
        regTypeLabel = user.registrationType;
    }

    // Send confirmation email with participant ID and QR code
    try {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🎉 Payment Verified!</h1>
          </div>
          
          <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">Dear <strong>${user.name}</strong>,</p>
            
            <p style="font-size: 14px; color: #555; line-height: 1.6;">
              Congratulations! Your payment for <strong>SHACKLES 2025</strong> has been successfully verified. 
              We're excited to have you join us!
            </p>

            <div style="background: linear-gradient(135deg, #0ad7a1 0%, #08b587 100%); padding: 20px; border-radius: 10px; margin: 25px 0; text-align: center;">
              <p style="color: #ffffff; font-size: 14px; margin: 0 0 10px 0;">Your Participant ID</p>
              <h2 style="color: #ffffff; font-size: 36px; margin: 0; font-weight: bold; letter-spacing: 2px;">${participantId}</h2>
            </div>

            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; font-size: 18px; margin-top: 0;">Registration Details:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 14px;">Participant ID:</td>
                  <td style="padding: 8px 0; color: #333; font-weight: bold; font-size: 14px;">${participantId}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 14px;">Registration Type:</td>
                  <td style="padding: 8px 0; color: #333; font-weight: bold; font-size: 14px;">${regTypeLabel}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 14px;">Amount Paid:</td>
                  <td style="padding: 8px 0; color: #333; font-weight: bold; font-size: 14px;">₹${user.paymentAmount}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 14px;">Transaction ID:</td>
                  <td style="padding: 8px 0; color: #333; font-size: 14px;">${user.transactionId}</td>
                </tr>
              </table>
            </div>

            ${qrBase64 ? `
            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #333; font-size: 14px; margin-bottom: 15px;">
                <strong>Your QR Code</strong><br>
                <span style="color: #666; font-size: 12px;">Present this at the event for check-in</span>
              </p>
              <img src="${qrBase64}" alt="QR Code" style="max-width: 300px; border: 2px solid #ddd; border-radius: 10px; padding: 10px; background: white;" />
              <p style="color: #999; font-size: 11px; margin-top: 10px;">
                Please save this QR code or take a screenshot
              </p>
            </div>
            ` : ''}

            <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <p style="color: #856404; margin: 0; font-size: 13px;">
                <strong>⚠️ Important:</strong> Please save your Participant ID (<strong>${participantId}</strong>) and QR code. 
                You will need to present this at the event registration desk.
              </p>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e9ecef;">
              <p style="color: #666; font-size: 13px; line-height: 1.6; margin: 10px 0;">
                📅 <strong>Event Date:</strong> [Event dates will be announced soon]<br>
                📍 <strong>Venue:</strong> Alagappa Chettiar Government College of Engineering and Technology<br>
                🏢 <strong>Department:</strong> Mechanical Engineering
              </p>
            </div>

            <p style="color: #555; font-size: 14px; margin-top: 20px;">
              Further details about the event schedule, venue, and guidelines will be shared with you soon.
            </p>

            <p style="color: #555; font-size: 14px; margin-top: 20px;">
              Looking forward to seeing you at SHACKLES 2025! 🚀
            </p>

            <p style="color: #333; font-size: 14px; margin-top: 30px;">
              Best regards,<br>
              <strong>SHACKLES Team</strong><br>
              <span style="color: #666; font-size: 12px;">Department of Mechanical Engineering, ACGCET</span>
            </p>
          </div>

          <div style="text-align: center; margin-top: 20px; padding: 15px;">
            <p style="color: #999; font-size: 11px; margin: 5px 0;">
              This is an automated email. Please do not reply to this email.
            </p>
            <p style="color: #999; font-size: 11px; margin: 5px 0;">
              For queries, contact us at <a href="mailto:shackles@acgcet.ac.in" style="color: #667eea;">shackles@acgcet.ac.in</a>
            </p>
          </div>
        </div>
      `;

      await sendEmail({
        email: user.email,
        subject: `✅ Payment Verified - Your Participant ID: ${participantId} | SHACKLES 2025`,
        message: emailHtml
      });

      console.log(`✅ Verification email sent to: ${user.email}`);

    } catch (emailError) {
      console.error('❌ Failed to send verification email:', emailError.message);
      // Don't fail the verification if email fails
    }

    console.log(`✅ Payment verified for user: ${user.email} | Participant ID: ${participantId}`);

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        user,
        participantId,
        qrCodeUrl
      }
    });

  } catch (error) {
    console.error('❌ Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
      error: error.message
    });
  }
};

// @desc    Reject user payment
// @route   PUT /api/v1/admin/payments/:userId/reject
// @access  Private/Admin
exports.rejectPayment = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a reason for rejection'
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update payment status
    user.paymentStatus = 'rejected';
    user.rejectionReason = reason;
    user.rejectedAt = Date.now();
    user.rejectedBy = req.user._id; // Admin who rejected

    await user.save();

    // Send rejection email
    try {
      await sendEmail({
        email: user.email,
        subject: '⚠️ Payment Verification Issue - SHACKLES 2025',
        message: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #e74c3c;">Payment Verification Issue</h1>
            <p>Dear ${user.name},</p>
            <p>We encountered an issue with your payment verification for SHACKLES 2025.</p>
            <p><strong>Reason:</strong> ${reason}</p>
            <p><strong>Transaction ID:</strong> ${user.transactionId}</p>
            <p><strong>What to do next:</strong></p>
            <ul>
              <li>Please verify your payment details</li>
              <li>Upload a clear screenshot of the payment</li>
              <li>Ensure the transaction ID matches your payment</li>
            </ul>
            <p>If you have any questions, please contact us.</p>
            <p>Best regards,<br>SHACKLES Team<br>Department of Mechanical Engineering, ACGCET</p>
          </div>
        `
      });
    } catch (emailError) {
      console.error('❌ Failed to send rejection email:', emailError.message);
    }

    console.log(`❌ Payment rejected for user: ${user.email}, Reason: ${reason}`);

    res.status(200).json({
      success: true,
      message: 'Payment rejected',
      data: user
    });

  } catch (error) {
    console.error('❌ Error rejecting payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject payment',
      error: error.message
    });
  }
};

// @desc    Get all verified payments
// @route   GET /api/v1/admin/payments/verified
// @access  Private/Admin
exports.getVerifiedPayments = async (req, res) => {
  try {
    const verifiedUsers = await User.find({
      paymentStatus: 'verified'
    })
      .select('name email phone college department year collegeLocation registrationType paymentAmount transactionId verifiedAt createdAt')
      .sort('-verifiedAt');

    res.status(200).json({
      success: true,
      count: verifiedUsers.length,
      data: verifiedUsers
    });

  } catch (error) {
    console.error('❌ Error fetching verified payments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch verified payments',
      error: error.message
    });
  }
};

// @desc    Get payment statistics
// @route   GET /api/v1/admin/payments/stats
// @access  Private/Admin
exports.getPaymentStats = async (req, res) => {
  try {
    const totalRegistrations = await User.countDocuments({ paymentScreenshot: { $exists: true } });
    const pendingPayments = await User.countDocuments({ paymentStatus: 'pending' });
    const verifiedPayments = await User.countDocuments({ paymentStatus: 'verified' });
    const rejectedPayments = await User.countDocuments({ paymentStatus: 'rejected' });

    // Calculate revenue
    const revenueStats = await User.aggregate([
      { $match: { paymentStatus: 'verified' } },
      {
        $group: {
          _id: '$registrationType',
          count: { $sum: 1 },
          totalRevenue: { $sum: { $toDouble: '$paymentAmount' } }
        }
      }
    ]);

    const totalRevenue = await User.aggregate([
      { $match: { paymentStatus: 'verified' } },
      {
        $group: {
          _id: null,
          total: { $sum: { $toDouble: '$paymentAmount' } }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalRegistrations,
        pendingPayments,
        verifiedPayments,
        rejectedPayments,
        totalRevenue: totalRevenue[0]?.total || 0,
        revenueByType: revenueStats
      }
    });

  } catch (error) {
    console.error('❌ Error fetching payment stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment statistics',
      error: error.message
    });
  }
};

// @desc    Get participant details by participant ID
// @route   GET /api/v1/admin/participant/:participantId
// @access  Private/Admin
exports.getParticipantById = async (req, res) => {
  try {
    const { participantId } = req.params;

    const user = await User.findOne({ participantId })
      .select('-password')
      .populate('verifiedBy', 'name email');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Participant not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('❌ Error fetching participant:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch participant details',
      error: error.message
    });
  }
};

// @desc    Regenerate QR code for participant
// @route   POST /api/v1/admin/participant/:participantId/regenerate-qr
// @access  Private/Admin
exports.regenerateQRCode = async (req, res) => {
  try {
    const { participantId } = req.params;

    const user = await User.findOne({ participantId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Participant not found'
      });
    }

    if (!user.participantId) {
      return res.status(400).json({
        success: false,
        message: 'User does not have a participant ID yet'
      });
    }

    // Generate new QR code
    const qrResult = await generateParticipantQR(user.participantId, {
      name: user.name,
      email: user.email,
      registrationType: user.registrationType
    });

    // Update user
    user.qrCode = qrResult.qrCodeUrl;
    user.qrCodeKey = qrResult.qrCodeKey;
    await user.save();

    console.log(`✅ QR code regenerated for: ${participantId}`);

    res.status(200).json({
      success: true,
      message: 'QR code regenerated successfully',
      data: {
        participantId: user.participantId,
        qrCodeUrl: user.qrCode
      }
    });

  } catch (error) {
    console.error('❌ Error regenerating QR code:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to regenerate QR code',
      error: error.message
    });
  }
};

// @desc    Get kit distribution statistics
// @route   GET /api/v1/admin/kit-stats
// @access  Private/Admin
exports.getKitStats = async (req, res) => {
  try {
    const KitDistribution = require('../models/KitDistribution');

    const totalKitsIssued = await KitDistribution.countDocuments();
    const kitsByType = await KitDistribution.aggregate([
      {
        $group: {
          _id: '$kitType',
          count: { $sum: 1 }
        }
      }
    ]);

    const recentKits = await KitDistribution.find()
      .sort('-issuedAt')
      .limit(10)
      .populate('issuedBy', 'name');

    res.status(200).json({
      success: true,
      kitsIssued: totalKitsIssued,
      kitsByType: kitsByType,
      recentKits: recentKits
    });
  } catch (error) {
    console.error('Error fetching kit stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch kit statistics',
      error: error.message
    });
  }
};

// @desc    Bulk email sending
// @route   POST /api/v1/admin/bulk-email
// @access  Private/Admin
exports.sendBulkEmails = async (req, res) => {
  try {
    const { userIds, emailType } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of user IDs'
      });
    }

    const users = await User.find({ _id: { $in: userIds } });

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No users found'
      });
    }

    let emailsSent = 0;
    let emailsFailed = 0;

    for (const user of users) {
      try {
        let subject = '';
        let message = '';

        switch (emailType) {
          case 'welcome':
            subject = 'Welcome to SHACKLES 2025!';
            message = `
              <h2>Welcome ${user.name}!</h2>
              <p>Thank you for registering for SHACKLES 2025.</p>
              <p>We're excited to have you join us!</p>
              ${user.participantId ? `<p>Your Participant ID: <strong>${user.participantId}</strong></p>` : ''}
              <p>Best regards,<br>SHACKLES Team</p>
            `;
            break;

          case 'reminder':
            subject = 'SHACKLES 2025 - Event Reminder';
            message = `
              <h2>Hello ${user.name}!</h2>
              <p>This is a reminder about your upcoming event at SHACKLES 2025.</p>
              <p>Don't forget to bring your ID card and QR code.</p>
              ${user.participantId ? `<p>Your Participant ID: <strong>${user.participantId}</strong></p>` : ''}
              <p>See you there!<br>SHACKLES Team</p>
            `;
            break;

          case 'qr':
            if (!user.participantId) {
              emailsFailed++;
              continue;
            }
            subject = 'Your SHACKLES 2025 QR Code';
            message = `
              <h2>Hello ${user.name}!</h2>
              <p>Here is your QR code for SHACKLES 2025.</p>
              <p>Participant ID: <strong>${user.participantId}</strong></p>
              <p>Please save this QR code and present it at the event for check-in.</p>
              <p>Best regards,<br>SHACKLES Team</p>
            `;
            break;

          default:
            subject = 'Message from SHACKLES 2025';
            message = `
              <h2>Hello ${user.name}!</h2>
              <p>This is a message from SHACKLES 2025.</p>
              <p>Best regards,<br>SHACKLES Team</p>
            `;
        }

        await sendEmail({
          email: user.email,
          subject: subject,
          message: message
        });

        emailsSent++;
      } catch (emailError) {
        console.error(`Failed to send email to ${user.email}:`, emailError);
        emailsFailed++;
      }
    }

    res.status(200).json({
      success: true,
      message: 'Bulk email process completed',
      emailsSent: emailsSent,
      emailsFailed: emailsFailed,
      total: users.length
    });

  } catch (error) {
    console.error('Error sending bulk emails:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send bulk emails',
      error: error.message
    });
  }
};

// @desc    Get event statistics
// @route   GET /api/v1/admin/event-stats
// @access  Private/Admin
exports.getEventStats = async (req, res) => {
  try {
    const Workshop = require('../models/Workshop');
    const Attendance = require('../models/Attendance');

    const totalEvents = await Event.countDocuments();
    const totalWorkshops = await Workshop.countDocuments();

    const now = new Date();
    const upcomingEvents = await Event.countDocuments({
      date: { $gt: now },
      status: 'upcoming'
    });

    const activeWorkshops = await Workshop.countDocuments({
      status: 'active'
    });

    const totalRegistrations = await Registration.countDocuments();
    const totalAttendance = await Attendance.countDocuments();

    res.status(200).json({
      success: true,
      stats: {
        totalEvents,
        totalWorkshops,
        upcomingEvents,
        activeWorkshops,
        totalRegistrations,
        totalAttendance
      }
    });
  } catch (error) {
    console.error('Error fetching event stats:', error);
    res.status(200).json({
      success: true,
      stats: {
        totalEvents: 0,
        totalWorkshops: 0,
        upcomingEvents: 0,
        activeWorkshops: 0,
        totalRegistrations: 0,
        totalAttendance: 0
      }
    });
  }
};

// @desc    Generate participant ID for a user
// @route   POST /api/v1/admin/generate-participant-id/:userId
// @access  Private/Admin
exports.generateUserParticipantId = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.participantId) {
      return res.status(400).json({
        success: false,
        message: 'Participant ID already exists for this user'
      });
    }

    if (user.paymentStatus !== 'verified') {
      return res.status(400).json({
        success: false,
        message: 'Payment must be verified before generating participant ID'
      });
    }

    // Generate participant ID
    const participantId = await generateParticipantId(user.registrationType);
    user.participantId = participantId;

    // Generate QR code
    const qrCodeData = {
      participantId: participantId,
      name: user.name,
      email: user.email,
      registrationType: user.registrationType,
      generatedAt: new Date().toISOString(),
      eventName: 'SHACKLES 2025'
    };

    const qrCodeBuffer = await generateParticipantQR(qrCodeData);
    const s3Key = `participant-qr-code/${participantId}.png`;
    const qrCodeUrl = await uploadToS3(qrCodeBuffer, s3Key);

    user.qrCode = qrCodeUrl;
    await user.save();

    console.log(`✅ Participant ID generated: ${participantId} for user: ${user.name}`);

    res.status(200).json({
      success: true,
      message: 'Participant ID generated successfully',
      data: {
        participantId: user.participantId,
        qrCodeUrl: user.qrCode
      }
    });

  } catch (error) {
    console.error('Error generating participant ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate participant ID',
      error: error.message
    });
  }
};
