const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const auth = require('../middleware/auth');

// Route to create a new location
router.post('/', locationController.createLocation);

// More routes here for other operations (get, update, delete, etc.)
router.get('/', locationController.getAllLocations);

router.put('/:locationId', locationController.updateLocation);
router.delete('/:locationId', locationController.deleteLocation);

router.post('/:locationId/rooms', locationController.addRoomToLocation)

module.exports = router;