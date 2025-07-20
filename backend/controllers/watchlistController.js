
const Watchlist = require("../models/Watchlist");

// Create a new watchlist
exports.createWatchlist = async (req, res) => {
  const { name } = req.body;
  const existing = await Watchlist.findOne({ userId: req.user.id, name });

  if (existing)
    return res.status(409).json({ message: "Watchlist already exists" });

  const newList = new Watchlist({ userId: req.user.id, name, movies: [] });
  await newList.save();
  res.status(201).json(newList);
};

// Get all watchlists for a user
exports.getUserWatchlists = async (req, res) => {
  try {
    const userId = req.user.id;
    const lists = await Watchlist.find({ userId });
    res.json(lists);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch watchlists" });
  }
};

// Find or create default watchlist
exports.addMovieToWatchlist = async (req, res) => {
  try {
    const { movieId, title, posterPath } = req.body;

    if (!movieId || !title || !posterPath) {
      return res.status(400).json({ message: "Missing movie data" });
    } 
    let list = await Watchlist.findOne({
      userId: req.user.id,
      name: "My Watchlist",
    });

    if (!list) {
      list = new Watchlist({
        userId: req.user.id,
        name: "My Watchlist", 
        movies: [{ movieId, title, posterPath }],
      });
    } else {
      const alreadyExists = list.movies.some((m) => m.movieId === movieId);
      if (!alreadyExists) {
        list.movies.push({ movieId, title, posterPath });
      }
    }

    await list.save();
    res
      .status(201)
      .json({ message: "Movie added to watchlist", watchlist: list });
  } catch (err) {
    console.error("Watchlist add error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Remove a movie
exports.removeMovieFromWatchlist = async (req, res) => {
  const { id, movieId } = req.params;

  const watchlist = await Watchlist.findById(id);
  if (!watchlist)
    return res.status(404).json({ message: "Watchlist not found" });

  watchlist.movies = watchlist.movies.filter(
    (m) => m.movieId !== parseInt(movieId)
  );
  await watchlist.save();

  res.json({ message: "Movie removed", watchlist });
};

// Delete watchlist
exports.deleteWatchlist = async (req, res) => {
  await Watchlist.findByIdAndDelete(req.params.id);
  res.json({ message: "Watchlist deleted" });
};
