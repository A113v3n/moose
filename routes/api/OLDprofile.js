const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const Therapist = require("../../models/Therapist");

// @route GET api/profile/me
// @description Get current users profile
// @access Private
router.get("/me", auth, async (req, res) => {
  try {
    console.log("User ID:", req.user.id);
    const therapist = await Therapist.findById(req.user.id);
    console.log("Therapist:", therapist);
    if (!therapist) {
      return res.status(400).json({ msg: "There is no profile for this therapist" });
    }

    res.json(therapist);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

router.get("/dashboard", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    console.log("user:", user);
    const accountType = user.accountType;

    if (accountType < 1 || accountType > 3) {
      return res.status(400).json({ msg: "Invalid account type." });
    }

    res.json({ accountType });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route POST api/profile
// @description Create or Update User Profile
// @access Private

router.post("/", auth, async (req, res) => {
  console.log('Body:', req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let {
    availability
} = req.body;

  // Build profile Object to change
  const therapistFields = {

    availability,
  };

    if (availability)
      availability = JSON.parse(availability);
      therapistFields.availability = availability.map((item) => {
        const { day, timeRanges } = item;
      
        return {
          day,
          timeRanges: timeRanges.map((range) => ({
            startTime: new Date(range.startTime),
            endTime: new Date(range.endTime),
          })),
        };
      });

  try {
    console.log('Availability:', availability);
    let therapist = await Therapist.findById(req.user.id);

    if (therapist) {
      // Update Profile
      therapist = await Therapist.findByIdAndUpdate(
        req.user.id,
        { $set: therapistFields },
        { new: true }
      );
      return res.json(therapist);
    }

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});



// @route GET api/profile
// @description Get All Profiles
// @access Public

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", [
      "firstName",
      "lastName",
      "avatar",
    ]);
    console.log("profiles:", profiles);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
