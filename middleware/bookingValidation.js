const moment = require('moment');

const bookingValidation = (req, res, next) => {
  const { locationId, roomId, date, duration, clientId, start, end } = req.body;

  if (!locationId) {
    return res.status(400).json({ error: 'Location ID is required' });
  }

  if (!roomId) {
    return res.status(400).json({ error: 'Room ID is required' });
  }

  if (!date || !moment(date).isValid()) {
    return res.status(400).json({ error: 'Invalid date' });
  }

  if (![30, 45, 60, 90].includes(parseFloat(duration))) {
    return res.status(400).json({ error: 'Invalid duration. Duration must be either 30, 45, 60, or 90.' });
  }

  if (!start || !moment(start).isValid()) {
    return res.status(400).json({ error: 'Invalid start time' });
  }

  if (!end || !moment(end).isValid()) {
    return res.status(400).json({ error: 'Invalid end time' });
  }

  next();
};

module.exports = bookingValidation;
