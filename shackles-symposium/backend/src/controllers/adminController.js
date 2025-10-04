const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Payment = require('../models/Payment');
const exportToExcel = require('../utils/excelGenerator');
const exportToGoogleSheets = require('../utils/googleSheets');
const sendEmail = require('../utils/emailService');

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
