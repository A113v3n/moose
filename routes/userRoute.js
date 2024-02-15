const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.post(
  "/",
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
    check(
      "preferredTouch",
      "Please enter a valid preferred touch (light, medium, or firm)."
    )
      .optional({ checkFalsy: true })
      .isIn(["light", "medium", "firm"]),
    check("dateOfBirth", "Date of birth is required").isDate(),
    check("focusAreas").optional({ checkFalsy: true }).isArray(),
    check("avoidAreas").optional({ checkFalsy: true }).isArray(),
    check("onMedication", "Please specify if the user is on medication")
      .exists()
      .bail()
      .custom((value) => value === "true" || value === "false"),
    check("medicationList")
      .if((value, { req }) => req.body.onMedication === "true")
      .notEmpty()
      .withMessage("Please list your medications"),
    check("isPregnant", "Please specify if the user is pregnant")
      .exists()
      .bail()
      .custom((value) => value === "true" || value === "false"),
    check("weeksPregnant")
      .if((value, { req }) => req.body.isPregnant === "true")
      .bail()
      .notEmpty()
      .withMessage("Please provide weeks pregnant")
      .isInt({ min: 1 })
      .withMessage("Weeks pregnant must be greater than one"),
  ],
  userController.createUser
);

router.get('/user-bookings', auth, userController.getUserBookings);

module.exports = router;