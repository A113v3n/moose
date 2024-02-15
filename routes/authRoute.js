const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// @route GET api/auth
// @description Test route
// @access Public
router.get("/", auth, authController.getUser);

// @route POST api/auth
// @descr Authenticate user & get token
// @access Public
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists()
  ],
  authController.authenticateUser
);

module.exports = router;
