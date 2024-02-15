const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true
    },
    status: {
      type: String,
      enum: ["available", "booked"],
      default: "available"
    },
    currentTherapist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Therapist",
    },
    availability: [
      {
        day: {
          type: Number, // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
          min: 0,
          max: 6,
          required: true,
        },
        timeRanges: [
          {
            startTime: {
              type: String,
              required: true,
            },
            endTime: {
              type: String,
              required: true,
            },
          },
        ],
      },
    ],
  });
  
  module.exports = mongoose.model("Room", RoomSchema);
  