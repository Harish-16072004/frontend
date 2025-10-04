const express = require('express');
const router = express.Router();
const {
  createRegistration,
  getRegistrations,
  getRegistration,
  updateRegistration,
  deleteRegistration,
  getUserRegistrations,
  cancelRegistration,
  downloadTicket
} = require('../controllers/registrationController');
const { protect, authorize } = require('../middleware/auth');

// Protected routes
router.use(protect);

router.route('/')
  .post(createRegistration)
  .get(authorize('admin'), getRegistrations);

router.get('/my-registrations', getUserRegistrations);

router.route('/:id')
  .get(getRegistration)
  .put(authorize('admin'), updateRegistration)
  .delete(authorize('admin'), deleteRegistration);

router.post('/:id/cancel', cancelRegistration);
router.get('/:id/download-ticket', downloadTicket);

module.exports = router;
