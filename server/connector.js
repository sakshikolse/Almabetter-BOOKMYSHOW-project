// Require the MongoDB and dotenv modules
const mongodb = require('mongodb');
const dotenv = require("dotenv");
dotenv.config();// Load environment variables from a .env file
const mongoURI = process.env.MONGO_URI;// Retrieve the MongoDB URI from the environment variables
let mongoose = require('mongoose');// Require the mongoose library for MongoDB interactions
const { bookMovieSchema } = require('./schema')// Require the bookMovieSchema from the 'schema' file

// Connect to the MongoDB server using mongoose
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log("connection established with mongodb server online"); })
    .catch(err => {
        console.log("error while connection", err)
    });

// Create a mongoose model for the 'bookmovietickets' collection using the bookMovieSchema   
let collection_connection = mongoose.model('bookmovietickets', bookMovieSchema)

// Export the mongoose model for external use
exports.connection = collection_connection;
