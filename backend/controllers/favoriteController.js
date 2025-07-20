const Favorite = require("../models/Favorite");

// Add a movie to favorites
exports.addFavoriteMovie = async (req, res) => {
  const { movieId, title, posterPath } = req.body;

  try {
    const existing = await Favorite.findOne({ userId: req.user.id, movieId });
    if (existing) {
      return res.status(200).json({ message: "Already added" });
    }

    const newFav = new Favorite({
      userId: req.user.id,
      movieId,
      title,
      posterPath,
    });
    await newFav.save();
    res.status(201).json(newFav);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


exports.removeFavoriteMovie = async (req, res) => {
  try {
    await Favorite.findOneAndDelete({
      userId: req.user.id,
      movieId: req.params.id,
    });
    res.json({ message: "Removed" });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove favorite movie" });
  }
};

// Get all favorite movies
exports.getFavoriteMovies = async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user.id });
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ error: "Failed to get favorites" });
  }
};
