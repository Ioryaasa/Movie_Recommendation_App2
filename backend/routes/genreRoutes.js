const express = require("express");
const router = express.Router();
const axios = require("axios");

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_KEY;

router.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`
    );
    res.json(response.data.genres);
  } catch (err) {
    console.error("Failed to fetch genres:", err.message);
    res.status(500).json({ error: "Failed to load genres" });
  }
});

module.exports = router;
