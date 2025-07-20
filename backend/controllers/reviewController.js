const Review = require("../models/Review");

exports.addOrUpdateReview = async (req, res) => {
  const { movieId, rating, comment } = req.body;
  const userId = req.user.id;
  const username = req.user.name;

  try {
    const existing = await Review.findOne({ userId, movieId });

    if (existing) {
      existing.rating = rating;
      existing.comment = comment;
      await existing.save();
      return res.json(existing);
    }

    const newReview = new Review({
      userId,
      movieId,
      rating,
      comment,
      username,
    });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ error: "Failed to submit review" });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ movieId: req.params.id });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to get reviews" });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    await Review.findOneAndDelete({
      userId: req.user.id,
      movieId: req.params.id,
    });
    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete review" });
  }
};
