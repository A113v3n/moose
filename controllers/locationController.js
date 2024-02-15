const Location = require('../models/Location');
const Room = require('../models/Room');
// Function to create a new location
exports.createLocation = async (req, res) => {
  try {
    const location = new Location(req.body);
    await location.save();
    res.status(201).json(location);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// More controller functions here for other operations (get, update, delete, etc.)
exports.getAllLocations = async (req, res) => {
    try {
        const locations = await Location.find();
        res.json(locations);
    } catch (error) {
        console.error(err.message);
        res.status(500).json({ message: error.message });
    }
};

// Function to update a location
exports.updateLocation = async (req, res) => {
  const { locationId } = req.params;
  const updatedData = req.body;

  try {
    const location = await Location.findById(locationId);

    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    // Update each provided field of the location
    Object.keys(updatedData).forEach((key) => {
      location[key] = updatedData[key];
    });

    await location.save();
    res.status(200).json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to delete a location
exports.deleteLocation = async (req, res) => {
  const { locationId } = req.params;

  try {
    const location = await Location.findById(locationId);

    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    await Location.deleteOne({ _id: locationId });
    res.status(200).json({ message: 'Location deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.addRoomToLocation = async (req, res) => {
  const { locationId } = req.params;
  const { status, availability } = req.body; // destructuring status and availability from req.body
  
  try {
    const location = await Location.findById(locationId);

    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    const room = new Room({
      location: locationId,
      status,  // use status from req.body
      availability  // use availability from req.body
    });

    await room.save();

    location.rooms.push(room._id);
    await location.save();

    res.status(200).json({ message: 'Room added successfully', room });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
