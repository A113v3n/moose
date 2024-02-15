// Importing required modules
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { validationResult } = require("express-validator");
const Therapist = require("../models/Therapist");
const Location = require("../models/Location");
const moment = require('moment');
const momentTimeZone = require('moment-timezone');
const Booking = require('../models/Booking');

// Function to register a new therapist
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const existingTherapist = await Therapist.findOne({ $or: [{ email: req.body.email }, { phone: req.body.phone }] });
    if (existingTherapist) {
      return res.status(400).json({ errors: [{ msg: "User already exists" }] });
    }

    if (req.body.availability && Array.isArray(req.body.availability)) {
      req.body.availability = Object.values(
        req.body.availability.reduce((acc, { day, startTime, endTime }) => {
          if (!acc[day]) {
            acc[day] = { day, timeRanges: [] };
          }
          acc[day].timeRanges.push({
            startTime: moment.utc(startTime, "HH:mm").format("HH:mm"),
            endTime: moment.utc(endTime, "HH:mm").format("HH:mm"),
          });
          return acc;
        }, {})
      );
    } else {
      req.body.availability = [];
    }

    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    req.body.accountType = 2;

    // Set the lastAppointment to be the current date and time
    req.body.lastAppointment = new Date();

    const therapist = new Therapist(req.body);

    await therapist.save();

    const payload = {
      user: {
        id: therapist.id,
        accountType: therapist.accountType,
      },
    };

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
    console.error(err.message);
    res.status(500).send("Server error");
  }
}
// Function to update a therapist's profile
exports.updateProfile = async (req, res) => {
  // Check for validation errors in the request
  const errors = validationResult(req);
  // If there are validation errors, return a 400 status code with the error messages
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

    // Destructure fields from the request body
    const {
      firstName,
      lastName,
      email,
      phone,
      bio,
      experience,
      specializations,
      availability,
    } = req.body;
  
    // Prepare the fields to update
    const therapistFields = {
      firstName,
      lastName,
      email,
      phone,
      bio,
      experience,
      specializations,
    };
  
    // If availability is provided, parse it and add it to the fields to update
    if (availability) {
      const parsedAvailability = JSON.parse(availability);
      therapistFields.availability = parsedAvailability.map((item) => {
        const { day, timeRanges } = item;
        return {
          day,
          timeRanges: timeRanges.map((range) => ({
            startTime: moment.utc(range.startTime, "HH:mm:ss").format("HH:mm:ss"),
            endTime: moment.utc(range.endTime, "HH:mm:ss").format("HH:mm:ss"),
          })),
        };
      });
    }
  
    try {
      // Find the therapist by ID
      let therapist = await Therapist.findById(req.user.id);
  
      // If the therapist is found, update their profile and return it
      if (therapist) {
        therapist = await Therapist.findByIdAndUpdate(
          req.user.id,
          { $set: therapistFields },
          { new: true }
        );
        return res.json(therapist);
      }
    } catch (err) {
      // Log any server errors and return a 500 status code
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };

// Function to get a therapist's availability for location
exports.getAvailability = async (req, res) => {
    const locationId = req.params.locationId;
    
    try {
      const location = await Location.findById(locationId).populate('therapists');
      const availabilityPromises = location.therapists.map(async therapist => {
        return {
          therapistId: therapist._id,
          availability: therapist.availability
        };
      });
      
      const availabilities = await Promise.all(availabilityPromises);
  
      res.status(200).json({
        status: 'success',
        data: availabilities
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Server Error'
      });
    }
  };

exports.addLocationToTherapist = async (req, res) => {
    const { therapistId, locationId } = req.body;
  
    try {
      const therapist = await Therapist.findById(therapistId);
      if (!therapist) {
        return res.status(404).json({ message: 'Therapist not found' });
      }
  
      // Add the locationId to the therapist's locations array
      therapist.locations.push(locationId);
  
      await therapist.save();
  
      res.status(200).json({
        message: 'Location added successfully',
        therapist,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

exports.getTherapistProfile = async (req, res) => {
  try {
    const therapist = await Therapist.findById(req.params.id);
    if (!therapist) return res.status(404).json({ msg: 'Therapist not found' });
    res.json(therapist);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}

exports.getTherapistsByLocation = async (req, res) => {
  try {
    const therapists = await Therapist.find({ locations: req.params.locationId });
    res.json(therapists);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}
// Fetch all bookings assigned to a particular therapist.
exports.getTherapistBookings = async (req, res) => {
  const therapistId = req.user.id;
  const accountType = req.user.accountType;

  if (accountType !== 2) {
    return res.status(403).json({ message: 'You do not have permission to access these bookings.' });
  }

  try {
    const bookings = await Booking.find({ therapist: therapistId }).populate('client room location');
    // The above line finds all bookings where the therapist ID is the same as the currently authenticated user.

    if (!bookings) {
      return res.status(404).json({ message: 'No bookings found for this therapist.' });
    }

    res.status(200).json({ bookings });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'An error occurred while fetching the bookings', error: error.message });
  }
};

// Function to confirm a booking
exports.confirmBooking = async (req, res) => {
  const bookingId = req.params.bookingId;
  const userId = req.user.id;
  const accountType = req.user.accountType;

  if (accountType !== 2) { // Assuming 2 is the account type for therapist
    return res.status(403).json({ message: 'You are not authorized to confirm bookings' });
  }

  try {
      const booking = await Booking.findById(bookingId);
      if (!booking) {
          return res.status(404).json({ message: 'Booking not found' });
      }

      const therapist = await Therapist.findById(userId);
      console.log('Therapist: ', userId)
      console.log('Therapist ID: ', booking.therapist)
      if (!therapist || !therapist._id.equals(booking.therapist)) {
        
          return res.status(403).json({ message: 'You are not authorized to confirm this booking' });
      }

      booking.status = 'accepted';
      await booking.save();

      res.status(200).json({
          message: 'Booking confirmed successfully',
          booking,
      });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

// Function to deny a booking
exports.denyBooking = async (req, res) => {
  const bookingId = req.params.bookingId;
  const userId = req.user.id;
  const accountType = req.user.accountType;

  if (accountType !== 2) { // Assuming 2 is the account type for therapist
    return res.status(403).json({ message: 'You are not authorized to deny bookings' });
  }

  try {
      const booking = await Booking.findById(bookingId);
      if (!booking) {
          return res.status(404).json({ message: 'Booking not found' });
      }

      const therapist = await Therapist.findById(userId);
      if (!therapist || !therapist._id.equals(booking.therapist)) {
          return res.status(403).json({ message: 'You are not authorized to deny this booking' });
      }

      booking.status = 'cancelled';
      await booking.save();

      res.status(200).json({
          message: 'Booking denied successfully',
          booking,
      });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

async function isBookingClash(therapistId, roomId, start, end) {
  const bookings = await Booking.find({
    start: { $lt: end },
    end: { $gt: start },
    status: { $ne: 'cancelled' }
  });
  
  const therapistBooking = bookings.find(booking => booking.therapist.toString() === therapistId);
  if (therapistBooking) {
    throw new Error('This therapist already has a booking during this time.');
  }

  const roomBooking = bookings.find(booking => booking.room.toString() === roomId);
  if (roomBooking) {
    throw new Error('This room is already booked during this time.');
  }
}

exports.editBooking = async (req, res) => {
  const { start, duration } = req.body;
  const bookingId = req.params.bookingId;

  if (moment().startOf('day').isAfter(moment(start).startOf('day'))) {
    return res.status(400).json({ message: 'You cannot book a date that has already passed.' });
  }

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    const newStart = new Date(start);
    const newEnd = moment(newStart).add(duration, 'minutes').toDate(); // calculate end time based on duration

    // Check for booking clash with other bookings of the same therapist
    await isBookingClash(booking.therapist.toString(), booking.room.toString(), newStart, newEnd);

    booking.start = newStart;
    booking.end = newEnd;
    booking.duration = duration;
    
    await booking.save();

    res.status(200).json({
      message: 'Booking updated successfully',
      booking: booking
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'An error occurred while updating the Booking', error: error });
  }
};
