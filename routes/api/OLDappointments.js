// routes/api/appointments.js
const express = require("express");
const router = express.Router();
const Appointment = require("../../models/Appointment");
const Therapist = require("../../models/Therapist");
const auth = require("../../middleware/auth");

// Add your API routes here
// e.g., GET available appointments, POST book an appointment, etc.

// @route   GET api/appointments
// @desc    Get available appointments
// @access  Public
router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find({ status: "available" });
    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/appointments/:id/book
// @desc    Book an appointment
// @access  Private
router.post("/:id/book", auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ msg: "Appointment not found" });
    }

    // Check if the appointment is available
    if (appointment.status !== "available") {
      return res.status(400).json({ msg: "Appointment is not available" });
    }

    appointment.status = "pending";
    appointment.client = req.user.id;
    await appointment.save();

    // Implement round-robin logic here and send a notification to the therapist

    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
