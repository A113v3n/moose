// Import required modules
const mongoose = require("mongoose");
const config = require("config");

// Retrieve the MongoDB URI from the config file
const db = config.get("mongoURI");

// Create an asynchronous function to connect to the MongoDB database
const connectDB = async () => {
  try {
    // Attempt to establish a connection using the MongoDB URI and options
    await mongoose.connect(db, {
      useNewUrlParser: true,
    });

    // Log a success message to the console when the connection is established
    console.log("MongoDB Connected...");
  } catch (err) {
    // Log the error message to the console if the connection attempt fails
    console.error(err.message);

    // Exit the process with a failure status code (1) if the connection attempt fails
    process.exit(1);
  }
};

// Export the connectDB function for use in other parts of the application
module.exports = connectDB;
