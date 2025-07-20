// models/Watchlist.js
const mongoose = require("mongoose");

const watchlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    movies: [
      {
        movieId: Number,
        title: String,
        posterPath: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Watchlist", watchlistSchema);
