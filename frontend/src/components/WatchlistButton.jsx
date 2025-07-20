import React, { useContext, useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';

const WatchlistButton = ({ movie }) => {
  const { token } = useContext(AuthContext);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    const checkWatchlist = async () => {
      if (!token) return;

      try {
        const res = await axios.get('/api/watchlists', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const watchlist = Array.isArray(res.data) ? res.data : res.data.watchlist;
        const alreadyAdded = watchlist?.some((item) => item.movieId === movie.id);
        setIsInWatchlist(alreadyAdded);
      } catch (err) {
        console.error('Error checking watchlist:', err);
      }
    };

    checkWatchlist();
  }, [movie.id, token]);

  const toggleWatchlist = async () => {
    if (!token) {
      toast.warning('Please log in to manage your watchlist');
      return;
    }

    try {
      if (isInWatchlist) {
        await axios.delete(`/api/watchlists/${movie.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsInWatchlist(false);
        toast.success('Removed from watchlist');
      } else {
        const res = await axios.post(
          '/api/watchlists/add',
          {
            movieId: movie.id,
            title: movie.title,
            posterPath: movie.poster_path,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const message = res.data?.message;

        // Success cases
        if (res.status === 201 || res.status === 200) {
          setIsInWatchlist(true);
          if (message === 'Movie already exists in watchlist') {
            toast.info(message);
          } else {
            toast.success(message || 'Movie added to watchlist');
          }
        }
      }
    } catch (err) {
      console.error('Error updating watchlist', err);
      if (err.response?.status === 409) {
        toast.info('This movie is already in your watchlist.');
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    }
  };


  return (
    <button
      onClick={toggleWatchlist}
      className="text-yellow-500 hover:text-yellow-700 text-xl mr-2"
      title={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      {isInWatchlist ? <FaBookmark /> : <FaRegBookmark />}
    </button>
  );
};

export default WatchlistButton;
