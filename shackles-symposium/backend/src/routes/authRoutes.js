const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updatePassword,
  updateProfile
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { uploadPaymentProof } = require('../middleware/upload');

// Public routes
router.post('/register', uploadPaymentProof, register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);

// Protected routes
router.use(protect); // All routes below this are protected
router.get('/me', getMe);
router.post('/logout', logout);
router.put('/update-password', updatePassword);
router.put('/update-profile', updateProfile);

module.exports = router;
