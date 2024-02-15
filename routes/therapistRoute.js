const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const auth = require("../middleware/auth");
const therapistController = require("../controllers/therapistController");


// @route POST api/therapist/register
// @description Register a new therapist
// @access Public
// ## WORKS IN POSTMAN ##
router.post("/register",
  [
    check("firstName", "First name is required").not().isEmpty(),
    check("lastName", "Last name is required").not().isEmpty(),
    check("email", "Please include a valid email.").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
    check("phone", "Please enter a valid US phone number.").isMobilePhone(
      "en-US"
    ),
  ],
  therapistController.register
);
// ## WORKS IN POSTMAN ##
router.post("/", auth, therapistController.updateProfile);

// get therapist availability at a given location ## WORKS IN POSTMAN ##
router.get('/availability/:locationId', therapistController.getAvailability);

// Route to add location to a therapist ## WORKS IN POSTMAN ##
router.post('/addlocation', auth, therapistController.addLocationToTherapist);

// @route PUT api/therapist/confirmbooking/:bookingId
// @description Confirm a booking
// @access Protected
router.put('/confirmbooking/:bookingId', auth, therapistController.confirmBooking);

// @route PUT api/therapist/denybooking/:bookingId
// @description Deny a booking
// @access Protected
router.put('/denybooking/:bookingId', auth, therapistController.denyBooking);

// Route to fetch all bookings for the authenticated therapist
router.get('/bookings', auth, therapistController.getTherapistBookings);

router.put('/editbooking/:bookingId', auth, therapistController.editBooking);

module.exports = router;
