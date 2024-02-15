// Here, we are importing necessary dependencies: models and libraries.
// The models 'Booking', 'Room' and 'Therapist' are imported from the 'models' directory.
const mongoose = require('mongoose');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Therapist = require('../models/Therapist');

// 'moment' is a popular library to manipulate dates and times in JavaScript. 
// 'moment-timezone' is an add-on for 'moment' to handle dates and times across different timezones.
const moment = require('moment');
const momentTimeZone = require('moment-timezone');
const { v4:uuidv4 } = require('uuid');
mongoose.model('User', User.schema);
mongoose.model('Booking', Booking.schema);
mongoose.model('Room', Room.schema);
mongoose.model('Therapist', Therapist.schema);

async function getAvailableTherapist(locationId, date, start, end, therapists) {
  const availableTherapists = therapists.filter(therapist => 
    therapist.locations.includes(locationId) &&
    therapist.availability.some(a => a.day === new Date(date).getDay() && a.timeRanges.some(timeRange => 
      timeRange.startTime <= start && timeRange.endTime >= end
    ))
  ).sort((a, b) => a.lastAppointment - b.lastAppointment);  // Sort by ascending lastAppointment time.

  if (availableTherapists.length === 0) {
    throw new Error('No available therapists found for the given slot.');
  }

  const therapistId = availableTherapists[0]._id;  // Select the therapist who had their last appointment the longest time ago.

  // Update the lastAppointment of the selected therapist.
  await Therapist.updateOne({ _id: therapistId }, { lastAppointment: new Date() });
  console.log(therapistId)
  return therapistId;
}

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

exports.createBooking = async (req, res) => {
  const { locationId, roomId, date, duration, start, end } = req.body;
  const userId = req.user.id;

  if (moment().startOf('day').isAfter(moment(date).startOf('day'))) {
    return res.status(400).json({ message: 'You cannot book a date that has already passed.' });
  }

  try {
    const therapists = await Therapist.find({}, '_id locations availability lastAppointment'); //fetch all therapists
    const therapistId = await getAvailableTherapist(locationId, date, start, end, therapists);

    const userBooking = await Booking.findOne({
      client: userId,
      start: { $lt: end },
      end: { $gt: start },
      status: { $ne: 'cancelled' }
    });
    if (userBooking) {
      throw new Error('You already have a booking during this time.');
    }

    // Check for booking clash
    await isBookingClash(therapistId, roomId, start, end);

    const booking = new Booking({
      location: locationId,
      room: roomId,
      date: new Date(date),
      duration: duration,
      therapist: therapistId,
      client: userId,
      start: new Date(start),
      end: new Date(end),
      status: 'pending'
    });

    await booking.save();

    res.status(201).json({
      message: 'Booking created successfully',
      booking: booking
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'An error occurred while creating the Booking', error: error });
  }
};

// This function is responsible for getting available slots for the given date and location
exports.getAvailableSlots = async (req, res) => {
  const { locationId, date, duration, userTimeZone } = req.query;
  const userId = req.user.id;  // Added user ID
  const formattedDate = date;

  const momentDate = moment(formattedDate).tz(userTimeZone);
  if (moment().startOf('day').isAfter(momentDate.startOf('day'))) {
    return res.status(400).json({ message: 'You cannot book a date that has already passed.' });
  }

  let momentDuration;
  try {
    momentDuration = moment.duration(duration * 60 * 1000);
  } catch (error) {
    res.status(400).json({ error: `Invalid duration format: ${duration}` });
    return;
  }

  try {
    const therapists = await Therapist.find({ locations: locationId });
    if (therapists.length === 0) {
      return res.status(404).json({ message: 'No therapists found at the provided location.' });
    }

    const rooms = await Room.find({ location: locationId });
    if (rooms.length === 0) {
      return res.status(404).json({ message: 'No rooms found at the provided location.' });
    }

    if (!userTimeZone) {
      res.status(400).json({ error: `User timezone is missing` });
      return;
    }

    const availableSlots = [];
    const addedSlots = new Set();
    const momentDate = moment(formattedDate).tz(userTimeZone);
    const day = momentDate.day();

    // Fetch all bookings for the day and keep them in memory
    const dayStart = momentDate.clone().startOf('day');
    const dayEnd = momentDate.clone().endOf('day');
    const therapistIds = therapists.map(therapist => therapist._id);
    const roomIds = rooms.map(room => room._id);
    const allDayBookings = await Booking.find({
      $or: [
        { therapist: { $in: therapistIds } },
        { room: { $in: roomIds } },
      ],
      start: { $gte: dayStart, $lt: dayEnd },
      status: { $ne: 'cancelled' }
    });

    const userBookings = await Booking.find({
      client: userId,
      start: { $gte: dayStart, $lt: dayEnd },
      status: { $ne: 'cancelled' }
    });
  
    const userBookingsLookup = {};
    for (const booking of userBookings) {
      const userIdStr = booking.client.toString();
      if (!userBookingsLookup[userIdStr]) userBookingsLookup[userIdStr] = [];
      userBookingsLookup[userIdStr].push(booking);
    }
    for (const userIdStr in userBookingsLookup) {
      userBookingsLookup[userIdStr].sort((a, b) => a.start - b.start);
    }

    const therapistBookingsLookup = {};
    const roomBookingsLookup = {};
    for (const booking of allDayBookings) {
      const therapistIdStr = booking.therapist.toString();
      const roomIdStr = booking.room.toString();

      if (!therapistBookingsLookup[therapistIdStr]) therapistBookingsLookup[therapistIdStr] = [];
      if (!roomBookingsLookup[roomIdStr]) roomBookingsLookup[roomIdStr] = [];

      therapistBookingsLookup[therapistIdStr].push(booking);
      roomBookingsLookup[roomIdStr].push(booking);
    }

    for (const therapistIdStr in therapistBookingsLookup) {
      therapistBookingsLookup[therapistIdStr].sort((a, b) => a.start - b.start);
    }
    for (const roomIdStr in roomBookingsLookup) {
      roomBookingsLookup[roomIdStr].sort((a, b) => a.start - b.start);
    }

    for (let therapist of therapists) {
      let therapistAvailability = therapist.availability.find(a => a.day === day);
      if (!therapistAvailability) continue;

      for (let room of rooms) {
        let roomAvailability = room.availability.find(a => a.day === day);
        if (!roomAvailability) continue;

        for (let roomTimeRange of roomAvailability.timeRanges) {
          for (let therapistTimeRange of therapistAvailability.timeRanges) {
            let therapistStart = moment.utc(`${momentDate.format('YYYY-MM-DD')} ${therapistTimeRange.startTime}`, 'YYYY-MM-DD HH:mm');
            let therapistEnd = moment.utc(`${momentDate.format('YYYY-MM-DD')} ${therapistTimeRange.endTime}`, 'YYYY-MM-DD HH:mm');

            if (therapistEnd.isBefore(therapistStart)) {
              therapistEnd.add(1, 'day');
            }

            let roomStart = moment.utc(`${momentDate.format('YYYY-MM-DD')} ${roomTimeRange.startTime}`, 'YYYY-MM-DD HH:mm');
            let roomEnd = moment.utc(`${momentDate.format('YYYY-MM-DD')} ${roomTimeRange.endTime}`, 'YYYY-MM-DD HH:mm');

            if (roomEnd.isBefore(roomStart)) {
              roomEnd.add(1, 'day');
            }

            let start = moment.max(therapistStart, roomStart);
            let end = moment.min(therapistEnd, roomEnd);

            let iteration = 0;

            while (end.diff(start, 'milliseconds') >= momentDuration.asMilliseconds()) {
              if (iteration > 120) {
                break;
              }
              
              let slotStart = start.clone();
              let slotEnd = start.clone().add(momentDuration);
            
              if (slotEnd.isAfter(end)) {
                break;
              }
            
              let userStart = slotStart.clone().tz(userTimeZone).format();
              let userEnd = slotEnd.clone().tz(userTimeZone).format();
            
              const therapistBookings = therapistBookingsLookup[therapist._id.toString()] || [];
              const roomBookings = roomBookingsLookup[room._id.toString()] || [];
            
              let slotStartUTC = slotStart.clone().utc();
              let slotEndUTC = slotEnd.clone().utc();
              
              
              const overlapTherapistBooking = this.binarySearchOverlaps(therapistBookings, slotStartUTC, slotEndUTC);
              const overlapRoomBooking = this.binarySearchOverlaps(roomBookings, slotStartUTC, slotEndUTC);
            
              // If the slot overlaps with any booking, don't add it and move on to the next slot
              const overlapUserBooking = this.binarySearchOverlaps(userBookingsLookup[userId], slotStartUTC, slotEndUTC);
              if (overlapTherapistBooking || overlapRoomBooking || overlapUserBooking) {
                start.add(30, 'minutes'); // adding 5 minutes to the start time
                iteration++;
                continue;
              }
            
              let id = uuidv4();
              let slotKey = `${userStart}-${userEnd}`;
            
              if (!addedSlots.has(slotKey)) {
                availableSlots.push({ id, start: userStart, end: userEnd, roomId: room.id });
                addedSlots.add(slotKey);
              }
            
              start = slotEnd; // incrementing the start time by the end of the current slot
              iteration++;
            }
          }
        }
      }
    }

    if (availableSlots.length === 0) {
      return res.status(404).json({ message: 'No slots available for the given date and location.' });
    }
    
    availableSlots.sort((a, b) => {
      return moment(a.start).valueOf() - moment(b.start).valueOf();
    });

    res.status(200).json({
      message: 'Fetched available slots successfully',
      slots: availableSlots,
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

exports.binarySearchOverlaps = (bookings, start, end) => {
  // Check if bookings is not undefined
  if (!bookings) {
    return null;
  }

  let low = 0, high = bookings.length - 1;

  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    const booking = bookings[mid];

    if (booking.start < end && booking.end > start) return booking;
    else if (booking.end <= start) low = mid + 1;
    else high = mid - 1;
  }

  return null;
};

// This function retrieves all Booking from the database.++++++++++
exports.getBooking = async (req, res) => {
  try {
    // We fetch all Bookings from the database, and populate related information about the user, therapist, and location.
    const bookings = await Booking.find().populate('user').populate('therapist').populate('location');

    // If successful, we send back a success response with status code 200 and the list of Booking.
    res.status(200).json({
      message: 'Fetched Bookings successfully',
      bookings,
    });
  } catch (error) {
    // If an error occurred, we send back a response with status code 500 and the error message.
    res.status(500).json({ error: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  const bookingId = req.params.bookingId;
  const userId = req.user.id;
  const accountType = req.user.accountType;

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }
    const therapist = await Therapist.findById(userId);
    const user = await User.findById(userId);

    if (booking.client.toString() !== userId && booking.therapist.toString() !== userId) {
      return res.status(403).json({ message: 'You do not have permission to access this booking.' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({ message: 'Booking cancelled successfully.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'An error occurred while cancelling the booking', error: error.message });
  }
};

exports.getBookingDetails = async (req, res) => {
  const bookingId = req.params.bookingId;
  const userId = req.user.id;
  const accountType = req.user.accountType;

  try {
    const booking = await Booking.findById(bookingId)
    // const bookings = await Booking.find(bookingId).populate('location').populate('therapist');
  
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }
    const therapist = await Therapist.findById(userId);
    const user = await User.findById(userId);
    console.log(booking.client)
    console.log(userId)
    if (booking.client.toString() !== userId && booking.therapist.toString() !== userId) {
      return res.status(403).json({ message: 'You do not have permission to access this booking.' });
    }
    res.status(200).json({
      booking: booking
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'An error occurred while fetching the Booking details', error: error.message });
  }
};

exports.fetchTherapists = async (req, res) => {
  try {
    const therapists = await Therapist.find({}, '_id locations availability lastAppointment firstName lastName');
    res.json(therapists);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch therapists' });
  }
};