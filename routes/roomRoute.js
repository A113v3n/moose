const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { checkRoomAvailability, bookRoom } = require('../controllers/roomController');

router.get('/availability/:roomId', roomController.checkRoomAvailability);

router.post('/book/:roomId', bookRoom);

module.exports = router;