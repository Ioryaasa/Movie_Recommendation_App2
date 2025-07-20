// src/components/FavoriteButton.jsx
import { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { toast } from 'react-toastify';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

const FavoriteButton = ({ movie }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const res = await axios.get('/api/favorites', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const favorites = Array.isArray(res.data)
          ? res.data
          : res.data.favorites;

        if (!Array.isArray(favorites)) {
          throw new Error('Invalid favorites data format');
        }

        const exists = favorites.some((fav) => fav.movieId === movie.id);
        setIsFavorite(exists);
      } catch (err) {
        console.error('Error checking favorite:', err);
      }
    };


    if (token && movie) checkFavorite();
  }, [movie, token]);

  const toggleFavorite = async () => {
    if (!token) return toast.error('Please login to favorite movies');

    try {
      if (isFavorite) {
        await axios.delete(`/api/favorites/${movie.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Removed from favorites');
      } else {
        await axios.post(
          '/api/favorites',
          {
            movieId: movie.id,
            title: movie.title,
            posterPath: movie.poster_path,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success('Added to favorites');
      }

      setIsFavorite(!isFavorite);
    } catch (err) {
      toast.error('Error updating favorites');
      console.error(err);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      className="text-2xl text-red-600 hover:scale-110 transition duration-200"
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isFavorite ? <AiFillHeart /> : <AiOutlineHeart />}
    </button>
  );
};

export default FavoriteButton;
