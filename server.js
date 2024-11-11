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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Parse URL-encoded bodies (form data).

// Define a GET route for the root URL
app.get('/', (req, res) => {
    res.send('Data Rep'); // Send a simple text response
});

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://admin:admin@cluster0.m7xdb.mongodb.net/');

const movieSchema = new mongoose.Schema({
    title: String,
    year: String,
    poster: String
  });
 
  const Movie = mongoose.model('Movie', movieSchema);

// Define a GET route to retrieve movie data
// app.get('/api/movies', (req, res) => {
//     // Sample array of movie objects
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

    app.get('/api/movies', async (req, res) => {
        const movies = await Movie.find({});
        res.json(movies);
      });

//     res.status(200).json({ whatever: movies }); // Send the movie data as a JSON response with status 200
// });

// Define a POST route to handle data submission
app.post('/api/movies', async (req, res) => {
    console.log("Movie added: "+req.body.title); // Log the request body to the console
    const {title,year,poster } = req.body;
    const newMovie = new Movie({title, year ,poster});
    await newMovie.save();

 res.status(201).json({ message: 'Movie created successfully', movie: newMovie });
});

app.get('/api/movie/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    res.send(movie);
  });

// Start the server and listen on the defined port
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`); // Log a message to the console when the server starts
});
