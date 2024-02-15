const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location'
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,  // Duration in minutes
    required: true,
  },
  start: {
    type: Date, // or the appropriate type for your needs
    required: true,
  },
  end: {
    type: Date, // or the appropriate type for your needs
    required: true,
  },
  therapist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "cancelled"],
    default: "pending",
  },
});

module.exports = mongoose.model("Booking", BookingSchema);
