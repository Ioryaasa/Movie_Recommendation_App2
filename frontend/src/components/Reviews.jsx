import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';

const Reviews = ({ movieId, token }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`/api/reviews/${movieId}`);
        setReviews(res.data);
      } catch (err) {
        console.error('Failed to load reviews', err);
      }
    };

    fetchReviews();
  }, [movieId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return alert('Please login to post a review');

    try {
      setLoading(true);
      const res = await axios.post(
        `/api/reviews/${movieId}`,
        { rating, comment },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReviews([res.data, ...reviews]);
      setRating(0);
      setComment('');
    } catch (err) {
      alert('Failed to post review');
    } finally {
      setLoading(false);
    }
  };

  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold mb-4 text-white">Reviews</h2>

      {averageRating && (
        <p className="text-yellow-400 font-semibold text-lg mb-2">
          ⭐ Average Rating: {averageRating} / 5
        </p>
      )}

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value))}
            min={1}
            max={5}
            className="p-2 rounded bg-gray-800 text-white w-24"
            placeholder="1-5"
            required
          />
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="flex-1 p-2 rounded bg-gray-800 text-white"
            placeholder="Write a comment (optional)"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            {loading ? 'Posting...' : 'Submit'}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-400">No reviews yet.</p>
        ) : (
          (showAll ? reviews : reviews.slice(0, 5)).map((rev, idx) => (
            <div key={idx} className="bg-gray-900 p-4 rounded">
              <p className="text-yellow-400 font-semibold">⭐ {rev.rating}</p>
              {rev.comment && <p className="text-white">{rev.comment}</p>}
              <p className="text-xs text-gray-400 mt-1">
                Posted: {new Date(rev.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>

      {reviews.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 text-sm text-red-400 hover:underline"
        >
          {showAll ? 'Show Less' : 'Show More'}
        </button>
      )}
    </div>
  );
};

export default Reviews;
