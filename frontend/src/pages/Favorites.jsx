import React, { useEffect, useState, useContext } from 'react';
import axios from '../axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
  const { token, user } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchFavorites = async () => {
      try {
        const res = await axios.get('/api/favorites', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFavorites(res.data);
      } catch (err) {
        console.error('Error loading favorites', err);
      }
    };

    fetchFavorites();
  }, [token, navigate]);

  const handleRemove = async (movieId) => {
    try {
      await axios.delete(`/api/favorites/${movieId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavorites(favorites.filter((movie) => movie.movieId !== movieId));
    } catch (err) {
      console.error('Failed to remove from favorites', err);
    }
  };

  return (
    <div className="p-4 min-h-screen bg-black text-white">
      <h1 className="text-2xl font-bold mb-4">Your Watchlist</h1>

      {favorites.length === 0 ? (
        <p>You have no saved movies.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {favorites.map((movie) => (
            <div key={movie._id} className="bg-gray-800 p-2 rounded">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                alt={movie.title}
                className="rounded mb-2 h-[250px] object-cover w-full"
              />
              <p className="text-sm text-center">{movie.title}</p>
              <button
                onClick={() => handleRemove(movie.movieId)}
                className="mt-2 w-full bg-red-600 hover:bg-red-700 text-xs px-2 py-1 rounded"
              >
                Remove from Watchlist
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
