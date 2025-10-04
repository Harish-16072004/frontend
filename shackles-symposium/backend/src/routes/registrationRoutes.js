const express = require('express');
const router = express.Router();
const {
  createRegistration,
  createRegistrationWithPayment,
  getRegistrations,
  getRegistration,
  updateRegistration,
  deleteRegistration,
  getUserRegistrations,
  downloadTicket
} = require('../controllers/registrationController');
const { protect, authorize } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');

// Protected routes
router.use(protect);

router.route('/')
  .post(createRegistration)
  .get(authorize('admin'), getRegistrations);

// New route: Registration with payment screenshot
router.post('/with-payment', uploadSingle('paymentScreenshot'), createRegistrationWithPayment);

router.get('/my-registrations', getUserRegistrations);

router.route('/:id')
  .get(getRegistration)
  .put(authorize('admin'), updateRegistration)
  .delete(authorize('admin'), deleteRegistration);

router.get('/:id/download-ticket', downloadTicket);

module.exports = router;
