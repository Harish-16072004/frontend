const Registration = require('../models/Registration');
const { generateQR } = require('../utils/qrGenerator');
const { uploadToS3 } = require('../utils/s3Upload');
const { sendEmail } = require('../utils/emailService');

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

// @desc    Verify payment (Approve or Reject)
// @route   PUT /api/v1/admin/registrations/:id/verify
// @access  Private/Admin
exports.verifyPayment = async (req, res) => {
  try {
    const { action, transactionId, rejectionReason } = req.body;
    const registrationId = req.params.id;

    // Validate action
    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Use "approve" or "reject"'
      });
    }

    // Find registration
    const registration = await Registration.findById(registrationId)
      .populate('user', 'name email phone college')
      .populate('event', 'name category date venue')
      .populate('workshop', 'title date venue');

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    // Check if already verified
    if (registration.verificationStatus !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Payment already ${registration.verificationStatus}`
      });
    }

    if (action === 'approve') {
      // Generate QR Code data
      const qrData = JSON.stringify({
        registrationNumber: registration.registrationNumber,
        userId: registration.user._id,
        name: registration.user.name,
        email: registration.user.email,
        eventId: registration.event?._id || registration.workshop?._id,
        eventName: registration.event?.name || registration.workshop?.title,
        type: registration.type,
        verifiedAt: new Date().toISOString()
      });

      // Generate QR Code image (returns buffer or base64)
      const qrCodeBuffer = await generateQR(qrData);

      // Prepare file object for S3 upload
      const qrFile = {
        buffer: qrCodeBuffer,
        originalname: `qr-${registration.registrationNumber}.png`,
        mimetype: 'image/png'
      };

      // Upload QR code to S3
      const qrFolder = process.env.S3_FOLDER_PARTICIPANT_QR || 'participant-qr-code';
      const qrUploadResult = await uploadToS3(qrFile, qrFolder);

      if (!qrUploadResult.success) {
        return res.status(500).json({
          success: false,
          message: 'Failed to upload QR code to S3'
        });
      }

      // Update registration
      registration.verificationStatus = 'approved';
      registration.paymentStatus = 'paid';
      registration.status = 'confirmed';
      registration.verifiedBy = req.user.id;
      registration.verifiedAt = new Date();
      registration.transactionId = transactionId || registration.transactionId;
      registration.qrCode = qrUploadResult.url;
      registration.qrCodeData = qrData;

      await registration.save();

      // Send confirmation email to user
      try {
        await sendEmail({
          to: registration.user.email,
          subject: 'Payment Verified - SHACKLES 2025 Registration Confirmed ✅',
          html: `
            <h2>Payment Verified Successfully!</h2>
            <p>Dear ${registration.user.name},</p>
            <p>Your payment has been verified and your registration is now <strong>CONFIRMED</strong>!</p>
            <p><strong>Registration Number:</strong> ${registration.registrationNumber}</p>
            <p><strong>Event:</strong> ${registration.event?.name || registration.workshop?.title}</p>
            <p><strong>Transaction ID:</strong> ${registration.transactionId}</p>
            <p>Your QR code has been generated. Please show this QR code at the event entrance.</p>
            <p><img src="${qrUploadResult.url}" alt="QR Code" style="width:200px;height:200px;"/></p>
            <p>See you at SHACKLES 2025!</p>
          `
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail the request if email fails
      }

      res.status(200).json({
        success: true,
        message: 'Payment approved successfully! QR code generated and sent to user.',
        data: registration
      });

    } else if (action === 'reject') {
      // Reject payment
      registration.verificationStatus = 'rejected';
      registration.paymentStatus = 'failed';
      registration.status = 'pending'; // Keep as pending, not cancelled
      registration.verifiedBy = req.user.id;
      registration.verifiedAt = new Date();
      registration.rejectionReason = rejectionReason || 'Payment verification failed';

      await registration.save();

      // Send rejection email
      try {
        await sendEmail({
          to: registration.user.email,
          subject: 'Payment Verification Failed - SHACKLES 2025',
          html: `
            <h2>Payment Verification Failed</h2>
            <p>Dear ${registration.user.name},</p>
            <p>Unfortunately, we were unable to verify your payment for the following reason:</p>
            <p><strong>${registration.rejectionReason}</strong></p>
            <p><strong>Event:</strong> ${registration.event?.name || registration.workshop?.title}</p>
            <p>Please try registering again with a valid payment proof or contact us for assistance.</p>
            <p>Email: support@shackles2025.com</p>
          `
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
      }

      res.status(200).json({
        success: true,
        message: 'Payment rejected successfully',
        data: registration
      });
    }

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
