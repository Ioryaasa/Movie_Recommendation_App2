const express = require("express");
const router = express.Router();
const {
  addOrUpdateReview,
  getReviews,
  deleteReview,
} = require("../controllers/reviewController");
const authMiddleware = require("../middleware/authMiddleware");

// GET reviews for movieId
router.get("/:id", getReviews); 

// POST 
router.post("/", authMiddleware, addOrUpdateReview); 

// DELETE by movieId
router.delete("/:id", authMiddleware, deleteReview); 

module.exports = router;
