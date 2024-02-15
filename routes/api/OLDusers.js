const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");

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
  async (req, res) => {
    // Check for validation errors and respond with a 400 status and error messages if found
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      preferredTouch,
      dateOfBirth,
      areasToFocus,
      areasToAvoid,
      onMedication,
      medicationList,
      isPregnant,
      weeksPregnant,
    } = req.body;

    try {
      let user = await User.findOne({ $or: [{ email }, { phone }] });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });
      // Create user
      user = new User({
        accountType: 1,
        firstName,
        lastName,
        email,
        password,
        phone,
        preferredTouch,
        dateOfBirth,
        areasToFocus,
        areasToAvoid,
        onMedication,
        medicationList,
        isPregnant,
        weeksPregnant,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // Create user profile
      const profileFields = {
        user: user.id,
        firstName,
        lastName,
        phone,
        preferredTouch,
        dateOfBirth,
        areasToFocus,
        areasToAvoid,
        onMedication,
        medicationList,
        isPregnant,
        weeksPregnant,
      };

      const profile = new Profile(profileFields);
      await profile.save();

      const payload = {
        user: {
          id: user.id,
          accountType: user.accountType, // Add this line
        },
      };

      // Sign the JWT and send it to the user as a response
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      // Log the error message to the console and respond with a 500 status code if an error occurs
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// Export the router for use in the application
module.exports = router;
