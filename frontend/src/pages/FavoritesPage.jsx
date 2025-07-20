// src/pages/Favorites.jsx
import React, { useEffect, useState, useContext } from 'react';
import axios from '../axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const Favorites = () => {
  const { token } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!token) return;

      try {
        const res = await axios.get('/api/favorites', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const favoriteMovies = Array.isArray(res.data)
          ? res.data
          : res.data.favorites || [];

        setFavorites(favoriteMovies);
      } catch (err) {
        console.error('Error fetching favorites', err);
        toast.error('Failed to load favorites');
      }
    };

    fetchFavorites();
  }, [token]);

  return (
    <div className="p-4">
      <div className="mt-20 bg-white">
    <h2 className="text-2xl font-bold mb-4">Your Favorite Movies</h2>
      {favorites.length === 0 ? (
        <p className="text-gray-500">No favorite movies yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {favorites.map((movie) => (
            <Link to={`/movie/${movie.movieId || movie.id}`} key={movie.id}>
              <div className="bg-white rounded shadow p-2">
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-60 object-cover rounded"
                />
                <h3 className="text-center mt-2 font-semibold">{movie.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      )}
      </div>
      
    </div>
  );
};

export default Favorites;
