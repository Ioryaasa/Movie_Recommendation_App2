const express = require('express');
const router = express.Router();

const {
  getPopularMovies,
  searchMovies,
  getMoviesByCategory,
  getMovieById,
  getMovieVideos,
  getSimilarMovies,
} = require('../controllers/movieController');

// Most specific routes first
router.get('/popular', getPopularMovies);
router.get('/search', searchMovies);
router.get('/category/:type', getMoviesByCategory);

// Least specific route last
router.get('/:id', getMovieById);
router.get('/:id/videos', getMovieVideos);
router.get('/:id/similar', getSimilarMovies);




module.exports = router;
