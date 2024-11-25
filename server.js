// Import the express module to create the server
const express = require('express');
const app = express(); // Create an instance of an Express application
const port = 4000; // Set the port number for the server

// Import the CORS module to handle cross-origin requests
const cors = require('cors');
app.use(cors()); // Enable CORS for all requests

// Middleware to set headers for handling CORS (Cross-Origin Resource Sharing)
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // Allow all domains to access this server
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"); // Allowed HTTP methods
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); // Allowed headers
  next(); // Continue to the next middleware or route handler
});

// Import the body-parser module to parse incoming request bodies
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies (form data)
app.use(bodyParser.json()); // Parse JSON bodies (e.g., for API requests)

// Define a GET route for the root URL
app.get('/', (req, res) => {
    res.send('Data Rep'); // Send a simple text response when accessing the root URL
});

// Import mongoose to interact with MongoDB
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://admin:admin@cluster0.m7xdb.mongodb.net/'); // Connect to MongoDB database

// Define a schema for the Movie collection in MongoDB
const movieSchema = new mongoose.Schema({
    title: String, // Movie title as a string
    year: String,  // Release year as a string
    poster: String // URL of the movie poster as a string
});

// Create a model for the Movie schema
const Movie = mongoose.model('Movie', movieSchema); // Defines a Movie model to interact with the Movie collection

// Define a GET route to retrieve movie data
// app.get('/api/movies', (req, res) => {
//     // Sample array of movie objects (hardcoded data)
//     const movies = [
//         {
//             "Title": "Avengers: Infinity War",
//             "Year": "2018",
//             "imdbID": "tt4154756",
//             "Type": "movie",
//             "Poster": "https://example.com/poster1.jpg"
//         },
//         {
//             "Title": "Captain America: Civil War",
//             "Year": "2016",
//             "imdbID": "tt3498820",
//             "Type": "movie",
//             "Poster": "https://example.com/poster2.jpg"
//         },
//         {
//             "Title": "World War Z",
//             "Year": "2013",
//             "imdbID": "tt0816711",
//             "Type": "movie",
//             "Poster": "https://example.com/poster3.jpg"
//         }
//     ];

    // Define an async GET route to retrieve all movies from the MongoDB database
    app.get('/api/movies', async (req, res) => {
        const movies = await Movie.find({}); // Retrieve all movie records from the Movie collection
        res.json(movies); // Send the movie data as a JSON response
    });

//     res.status(200).json({ whatever: movies }); // Send the movie data as a JSON response with status 200
// });

// Define a POST route to handle data submission and add a new movie to the database
app.post('/api/movies', async (req, res) => {
    console.log("Movie added: "+req.body.title); // Log the title of the movie being added
    const {title, year, poster } = req.body; // Destructure title, year, and poster from request body
    const newMovie = new Movie({ title, year, poster }); // Create a new Movie instance with the provided data
    await newMovie.save(); // Save the new movie to the database

    res.status(201).json({ message: 'Movie created successfully', movie: newMovie }); // Send a success response with the created movie
});

// Define a GET route to retrieve a specific movie by ID from the database
app.get('/api/movie/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id); // Find movie by ID from the Movie collection
    res.send(movie); // Send the found movie as a response
});


app.put('/api/movie/:id', async (req, res) => {
    let movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(movie);
});

// Define the DELETE route to remove a movie by its ID
app.delete('/api/movie/:id', async (req, res) => {
  
    // Log the ID of the movie that is being deleted for debugging purposes
    console.log('Deleting movie with ID:', req.params.id);

    try {
        // Find and delete the movie from the database by its ID
        const movie = await movieModel.findByIdAndDelete(req.params.id);

        // If the movie was not found (i.e., it might be null), return an error message
        if (!movie) {
            return res.status(404).send({ message: "Movie not found" });
        }

        // Respond with a success message and the deleted movie data
        res.status(200).send({ message: "Movie deleted successfully", movie });
    } catch (error) {
        // Handle any errors that may occur during the database operation
        console.error('Error deleting movie:', error);
        res.status(500).send({ message: "An error occurred while deleting the movie" });
    }
});

// Start the server and listen on the defined port
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`); // Log a message to the console when the server starts
});
