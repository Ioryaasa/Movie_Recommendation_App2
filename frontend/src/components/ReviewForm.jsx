import React, { useState } from 'react';

const ReviewForm = ({ initialRating = 0, initialComment = '', onSubmit, loading }) => {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating) return alert('Please select a rating');
    onSubmit({ rating, comment });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="p-2 rounded bg-gray-800 text-white"
        >
          <option value="">Select</option>
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>

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
  );
};

export default ReviewForm;
