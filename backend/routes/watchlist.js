const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createWatchlist,
  getUserWatchlists,
  addMovieToWatchlist,
  removeMovieFromWatchlist,
  deleteWatchlist,
} = require("../controllers/watchlistController");

router.use(authMiddleware);

//  Separate route for adding a movie

// POST /api/watchlists/add
router.post("/add", addMovieToWatchlist); 

// POST /api/watchlists
router.post("/", createWatchlist); 

// GET /api/watchlists
router.get("/", getUserWatchlists); 

// optionally keep for manual add to specific list
router.put("/:id", addMovieToWatchlist); 

// DELETE /api/watchlists/:id/movie/:movieId
router.delete("/:id/movie/:movieId", removeMovieFromWatchlist); 

// DELETE /api/watchlists/:id
router.delete("/:id", deleteWatchlist); 

module.exports = router;
