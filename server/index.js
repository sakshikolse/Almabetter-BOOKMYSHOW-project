// Require necessary modules and libraries
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require('cors');

const bookMovieSchema = require("./schema");// Require the bookMovieSchema from the 'schema' file

const port = 8080;// Set the port for the Express application

const path = require('path')// Require the 'path' module for working with file and directory paths

// Use bodyParser middleware for parsing JSON and URL-encoded data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const { connection } = require("./connector");// Require the mongoose connection from the 'connector' file

app.use(cors())// Enable CORS for all routes

const BookMovie = connection.model("bookmovietickets", bookMovieSchema);// Create a mongoose model for the 'bookmovietickets' collection using the bookMovieSchema

// Define a route for handling POST requests to create a new booking
app.post("/api/booking", async (req, res) => {
   // Log the incoming request body for debugging
    console.log(req.body);
    
     // Extract relevant information from the request body
    const { movie, slot, seats } = req.body;
      try {
      // Create a new booking using the BookMovie model
      const newBooking = new BookMovie({ movie, slot, seats });
      // Save the new booking to the database
      await newBooking.save();
       // Log the booking details for debugging
      console.log(movie, slot, seats);
  
      // Send a success response to the client
      res.status(200).json({ message: "Booking created successfully" });
    } catch (error) {
      // Handle errors and send an error response to the client
      console.error("Error while creating booking:", error);
      res
        .status(500)
        .json({ error: "An error occurred while creating the booking" ,detailedError: error.message});
    }
  });


  // Define a route for handling GET requests to fetch the last booking  
  app.get("/api/booking", async (req, res) => {
    try {
       // Fetch the last booking from the database, sorted by _id in descending order
      const lastBooking = await BookMovie.findOne().sort({ _id: -1 }).limit(1);
    // Check if a booking exists
      if (!lastBooking) {
        return res.json({ message: "No Previous Booking Found" });
      }
   
     // Send the last booking details as a JSON response
      res.status(200).json({
        movie: lastBooking.movie,
        seats: lastBooking.seats,
        slot: lastBooking.slot,
      });
    } catch (error) {
      // Handle errors and send an error response to the client
      console.error("Error while fetching the last booking:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while fetching the last booking" });
    }
  });
  
// Start the Express application and listen on the specified port
app.listen(port, () => console.log(`App listening on port ${port}!`));

module.exports = app; 

