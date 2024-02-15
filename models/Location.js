const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  rooms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room"
    }
  ],
  address: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zip: {
      type: String,
      required: true
    },
  },
  therapists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Therapist"
    }
  ],
  lastAssignedTherapist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Therapist"
  }
}, {
  timestamps: true
});

const Location = mongoose.model("Location", locationSchema);
module.exports = Location;