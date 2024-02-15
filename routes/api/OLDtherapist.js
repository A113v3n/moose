/// NO LONGER NEED THIS FILE




const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
const Therapist = require("../../models/Therapist");
const auth = require("../../middleware/auth");

// @route POST api/therapist/register
// @description Register a new therapist
// @access Public
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
      bio,
      profileImage,
      experience,
      specializations,
      maxClientsAtOnce,
      availability,
    } = req.body;

    try {
      let therapist = await Therapist.findOne({ $or: [{ email }, { phone }] });

      if (therapist) {
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
      therapist = new Therapist({
        accountType: 2,
        firstName,
        lastName,
        email,
        password,
        phone,
        bio,
        profileImage,
        experience,
        specializations,
        maxClientsAtOnce,
        availability: availability.map(({ day, startTime, endTime }) => ({
          day,
          timeRanges: [
            {
              startTime: new Date(startTime),
              endTime: new Date(endTime),
            },
          ],
        })),
      });

      const salt = await bcrypt.genSalt(10);
      therapist.password = await bcrypt.hash(password, salt);

      await therapist.save();

      const payload = {
        user: {
          id: therapist.id,
          accountType: therapist.accountType, // Add this line
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
