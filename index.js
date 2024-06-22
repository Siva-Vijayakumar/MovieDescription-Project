const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// Replace with your actual OMDB API key
const OMDB_API_KEY = 'd20039f4';

// Set up EJS as the templating engine
app.set('view engine', 'ejs');

// Middleware to serve static files
app.use(express.static('public'));

// Root route to render search page
app.get('/', (req, res) => {
    res.render('index', { movies: [], error: null });
});

// Search route to fetch movies from OMDB API
app.get('/search', async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.render('index', { movies: [], error: 'Please enter a valid search query.' });
    }

    try {
        const response = await axios.get(`http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${query}&type=movie`);
        const movies = response.data.Search || [];
        res.render('index', { movies, error: null });
    } catch (error) {
        console.error('Error fetching data from OMDB API:', error.message);
        res.render('index', { movies: [], error: 'An error occurred while fetching data from OMDB API.' });
    }
});

// Movie details route
app.get('/movie/:id', async (req, res) => {
    const movieId = req.params.id;

    try {
        const response = await axios.get(`http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${movieId}&plot=full`);
        const movie = response.data;
        res.render('movie', { movie, error: null });
    } catch (error) {
        console.error('Error fetching movie details from OMDB API:', error.message);
        res.render('movie', { movie: null, error: 'An error occurred while fetching movie details from OMDB API.' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
