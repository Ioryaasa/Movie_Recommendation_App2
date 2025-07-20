import React, { useEffect, useState, useContext } from 'react';
import axios from '../axiosConfig';
import { AuthContext } from '../context/AuthContext';
import ReviewForm from './ReviewForm';

const ReviewSection = ({ movieId }) => {
  const { token, user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`/api/reviews/${movieId}`);
      setReviews(res.data);

      // Check if user has already reviewed
      const existing = res.data.find((r) => r.userId === user?.id);
      setUserReview(existing || null);
    } catch (err) {
      console.error('Failed to fetch reviews', err);
    }
  };

  const handleSubmit = async ({ rating, comment }) => {
    try {
      await axios.post(
        '/api/reviews',
        { movieId, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchReviews();
    } catch (err) {
      console.error('Failed to submit review', err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/reviews/${movieId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchReviews();
    } catch (err) {
      console.error('Failed to delete review');
    }
  };

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <div className="mt-10 text-white">
      <h3 className="text-xl font-semibold mb-2">Reviews</h3>

      {averageRating && (
        <p className="text-red-400 mb-2">⭐ Average Rating: {averageRating} / 5</p>
      )}

      {user && (
        <div className="mb-4 flex flex-col">
          <h4 className="font-semibold mb-1">
            {userReview ? 'Edit Your Review' : 'Leave a Review'}
          </h4>
          <label className="block text-sm text-white pb-2">Rating (1-5):</label>
          <ReviewForm
            initialRating={userReview?.rating}
            initialComment={userReview?.comment}
            onSubmit={handleSubmit}
          />
          {userReview && (
            <button
              onClick={handleDelete}
              className="mt-2 text-sm text-red-500 hover:underline"
            >
              Delete Your Review
            </button>
          )}
        </div>
      )}

      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r._id} className="bg-gray-800 p-4 rounded">
            <p className="text-sm font-semibold text-red-300">{r.username}  ⭐ {r.rating}</p>
            <p className="text-sm text-gray-300">{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSection;
