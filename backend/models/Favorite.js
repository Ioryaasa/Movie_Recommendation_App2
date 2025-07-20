const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    movieId: { type: Number, required: true },
    title: String,
    posterPath: String,
  },
  { timestamps: true }
);

// Enforce uniqueness of (userId + movieId)
favoriteSchema.index({ userId: 1, movieId: 1 }, { unique: true });

module.exports = mongoose.model("Favorite", favoriteSchema);
