const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');
const bookingValidation = require('../middleware/bookingValidation');

// Route to book an Booking
router.post('/', auth, bookingValidation, bookingController.createBooking);

// Route to fetch available slots
router.get('/', auth, bookingController.getAvailableSlots);

// Route to fetch all Booking
router.get('/booking', auth, bookingController.getBooking);

router.get('/therapists', bookingController.fetchTherapists);

// Route to fetch a specific booking's details
router.get('/:bookingId', auth, bookingController.getBookingDetails);

// Route to cancel a specific booking
router.put('/cancel/:bookingId', auth, bookingController.cancelBooking);

module.exports = router;
