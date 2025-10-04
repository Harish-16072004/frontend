const express = require('express');
const router = express.Router();
const {
  getWorkshops,
  getWorkshop,
  createWorkshop,
  updateWorkshop,
  deleteWorkshop,
  getWorkshopRegistrations
} = require('../controllers/workshopController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getWorkshops);
router.get('/:id', getWorkshop);

// Protected admin routes
router.post('/', protect, authorize('admin'), createWorkshop);
router.put('/:id', protect, authorize('admin'), updateWorkshop);
router.delete('/:id', protect, authorize('admin'), deleteWorkshop);
router.get('/:id/registrations', protect, authorize('admin'), getWorkshopRegistrations);

module.exports = router;
