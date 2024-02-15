// Import required modules
const bcrypt = require('bcryptjs'); // Used for hashing passwords
const auth = require('../middleware/auth'); // Middleware for authentication
const jwt = require('jsonwebtoken'); // Used for generating JSON Web Tokens (JWT)
const config = require('config'); // Used for accessing configuration variables
const { validationResult } = require('express-validator'); // Used for request validation
const User = require('../models/User'); // User model
const Therapist = require('../models/Therapist'); // Therapist model

// Method to get user data
exports.getUser = async (req, res) => {
  try {
    let user;
    // Depending on the accountType, find the user in the corresponding collection and exclude the password
    if (req.user.accountType === 1) {
      user = await User.findById(req.user.id).select("-password");
    } else if (req.user.accountType === 2) {
      user = await Therapist.findById(req.user.id).select("-password");
    } else {
      return res.status(400).json({ msg: "Invalid account type" });
    }
    res.json(user); // Respond with the user data
  } catch (err) {
    console.error(err.message); // Log any errors
    res.status(500).send("Server Error"); // Respond with a server error if something goes wrong
  }
}

// Method to authenticate user
exports.authenticateUser = async (req, res) => {
    // Check for validation errors in the request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // If errors, return 400 status and errors
    }

    const { email, password } = req.body; // Extract email and password from the request body

    try {
      // Try to find the user in the User collection
      let user = await User.findOne({ email });

      // If not found in User collection, try to find in the Therapist collection
      if (!user) {
        user = await Therapist.findOne({ email });
      }

      // If not found in either collection, respond with a 400 status and an error message
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      // Compare the provided password with the hashed password in the database
      const isMatch = await bcrypt.compare(password, user.password);

      // If the passwords do not match, respond with a 400 status and an error message
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      // Prepare the payload for the JWT
      const payload = {
        user: {
          id: user.id,
          accountType: user.accountType || 1, // Set default accountType to 1 if not available
        },
      };

      // Sign the JWT and respond with it
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: "5 days" },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      // Log any server errors and respond with a 500 status code
      console.error(err.message);
      res.status(500).send("Server error");
    }
}
