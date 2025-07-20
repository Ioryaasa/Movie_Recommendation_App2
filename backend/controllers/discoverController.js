
const axios = require("axios");

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_KEY;

exports.discoverMovies = async (req, res) => {
  const { year, genre } = req.query;

  let url = `${TMDB_BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc`;

  if (year) url += `&primary_release_year=${year}`;
  if (genre) url += `&with_genres=${genre}`;

  try {
    const response = await axios.get(url);
    res.json(response.data.results);
  } catch (err) {
    console.error("❌ Error fetching discover movies:", err.message);
    res.status(500).json({ error: "Failed to fetch filtered movies" });
  }
};
