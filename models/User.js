const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  accountType: {
    type: Number,
    default: 1,
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
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  preferredTouch: {
    type: String,
    enum: ["light", "medium", "firm", ""],
    default: "",
  },
  areasToFocus: [
    {
      type: String,
      enum: [
        "head",
        "neck",
        "shoulders",
        "arms",
        "upper back",
        "lower back",
        "knees",
        "legs",
        "feet",
      ],
    },
  ],
  areasToAvoid: [
    {
      type: String,
      enum: [
        "head",
        "neck",
        "shoulders",
        "arms",
        "upper back",
        "lower back",
        "knees",
        "legs",
        "feet",
      ],
    },
  ],
  onMedication: {
    type: Boolean,
    required: true,
  },
  medicationList: {
    type: String,
    default: "",
  },
  isPregnant: {
    type: Boolean,
    required: true,
  },
  weeksPregnant: {
    type: Number,
    default: null,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = User = mongoose.model("user", UserSchema);
