
const moment = require('moment');
const momentTimeZone = require('moment-timezone');


exports.checkRoomAvailability = async (req, res) => {
    const roomId = req.params.roomId;
    
    const { day, startTime, endTime } = req.body;
    
    try {
      // Find the room
      const room = await Room.findById(roomId);
      console.log('Room: ', room)
      // Check if the room is available at the desired time
      const availability = room.availability.find(
        slot => slot.day === day &&
          slot.timeRanges.find(
            range => range.startTime <= startTime && range.endTime >= endTime
          )
      );
  
      if (availability) {
        res.status(200).json({ status: 'success', message: 'Room is available' });
      } else {
        res.status(400).json({ status: 'fail', message: 'Room is not available at this time' });
      }
  
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Server Error' });
    }
  };
  
  exports.bookRoom = async (req, res) => {
    const roomId = req.params.roomId;
    const { day, startTime, endTime } = req.body;
  
    // Further implementation depends on your booking logic.
    // You might need to create an Booking here and assign a therapist to this room.
  };
