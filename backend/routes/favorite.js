const express = require("express");
const router = express.Router();
const {
  addFavoriteMovie,
  removeFavoriteMovie,
  getFavoriteMovies,
} = require("../controllers/favoriteController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

//  /api/favorites
router.post("", addFavoriteMovie);

// GET /api/favorites
router.get("/", getFavoriteMovies);

// DELETE /api/favorites/:id
router.delete("/:id", removeFavoriteMovie);

module.exports = router;
