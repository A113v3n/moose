// Construct Express Server
const express = require("express");
// Require ds.js config file, which enables the ability to use fuctions (connectDB();)
const connectDB = require("./config/db");

// Initialize app variable with express
const app = express();
// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// Import therapist route
const therapistRoutes = require("./routes/therapistRoute");
const authRoutes = require("./routes/authRoute");
const userRoutes = require("./routes/userRoute");
const locationRoutes = require('./routes/locationRoute');
const bookingRoutes = require('./routes/bookingRoute');
const roomRoutes = require('./routes/roomRoute');
//Testing, when using postman to GET address, you can see if the express server is running correctly
app.get("/", (req, res) => res.send("API Running"));

// Define Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/therapist", therapistRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/rooms',roomRoutes);
app.use('/api/availability', bookingRoutes);
app.use('/api/bookings', bookingRoutes);
app.use("/api/gettherapist", bookingRoutes);

// Take that app variable and listen on port 5000
const PORT = process.env.PORT || 5000;

// Pass in Port,
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
