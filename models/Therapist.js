  const mongoose = require("mongoose");

  const therapistSchema = new mongoose.Schema(
    {
      therapist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Therapist",
      },
      currentRoom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
      },
      accountType: {
        type: Number,
        default: 2,
        required: true,
      },
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      bio: {
        type: String,
        required: false,
      },
      profileImage: {
        type: String,
        required: false,
      },
      experience: {
        type: Number,
        required: false,
      },
      specializations: {
        type: [String],
        required: false,
      },
      maxClientsAtOnce: {
        type: Number,
        default: 1,
      },
      lastAppointment: {
        type: Date,
        required: false,  // it can be null if no appointment has been set yet
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
      // New locations field
      locations: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Location",
        },
      ],
    },
    {
      timestamps: true,
    }
  );

  const Therapist = mongoose.model("Therapist", therapistSchema);
  module.exports = Therapist;