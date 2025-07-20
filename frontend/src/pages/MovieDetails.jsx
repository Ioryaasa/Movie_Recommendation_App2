import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from '../axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import ReviewSection from '../components/ReviewSection';
import FavoriteButton from '../components/FavoriteButton';
import WatchlistButton from '../components/WatchlistButton';


const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const { user, token } = useContext(AuthContext);
  const [trailerKey, setTrailerKey] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [userLists, setUserLists] = useState([]);



  const handleAddOrRemove = async () => {
    try {
      if (!isInWatchlist) {
        await axios.post('/api/favorites', {
          movieId: movie.id,
          title: movie.title,
          posterPath: movie.poster_path
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.delete(`/api/favorites/${movie.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setIsInWatchlist(!isInWatchlist);
    } catch (err) {
      toast.error('Watchlist toggle failed', err);
    }
  };

  const toggleWatchlist = async (movieId, isAdded) => {
    if (!user || !token) return toast.warning('Login first');

    try {
      if (isAdded) {
        await axios.delete(`/api/favorites/${movieId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWatchlist((prev) => prev.filter((item) => item.movieId !== movieId));
      } else {
        await axios.post('/api/favorites', {
          movieId: movie.id,
          title: movie.title,
          posterPath: movie.poster_path
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWatchlist((prev) => [...prev, { movieId }]);
      }
    } catch (err) {
      toast.error('Toggle watchlist error:', err);
    }
  };


  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(`/api/movies/${id}`);
        setMovie(res.data);
      } catch (err) {
        toast.error('Failed to load movie details', err);
      }
    };
    fetchMovie();
  }, [id]);


  useEffect(() => {
    const fetchTrailer = async () => {
      try {
        const res = await axios.get(`/api/movies/${id}/videos`);
        const trailer = res.data.find((vid) => vid.type === 'Trailer' && vid.site === 'YouTube');
        if (trailer) setTrailerKey(trailer.key);
      } catch (err) {
        toast.error('Failed to load trailer');
      }
    };
    fetchTrailer();
  }, [id]);

  const [relatedMovies, setRelatedMovies] = useState([]);


  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await axios.get(`/api/movies/${id}/similar`);
        setRelatedMovies(res.data);
      } catch (err) {
        toast.error('Error fetching related movies', err);
      }
    };

    fetchRelated();
  }, [id]);


  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!token) return;
      try {
        const res = await axios.get('/api/favorites', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWatchlist(res.data); 
      } catch (err) {
        toast.error('Error fetching watchlist:', err);
      }
    };
    fetchWatchlist();
  }, [token]);

  useEffect(() => {
    if (!movie) return;
    const fetchFavorites = async () => {
      try {
        const res = await axios.get('/api/favorites', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Use the correct path to the array
        const favorites = Array.isArray(res.data) ? res.data : res.data.favorites;

        const alreadyInList = favorites.some((item) => item.movieId === movie.id);
        setIsInWatchlist(alreadyInList);

      } catch (err) {
        console.error('Failed to check watchlist', err);
      }
    };
    fetchFavorites();
  }, [movie, token]);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const res = await axios.get('/api/watchlists');
        setUserLists(res.data);
      } catch (err) {
        console.error('Failed to fetch user lists');
      }
    };
    fetchLists();
  }, []);

  const saveToList = async (listId) => {
    try {
      await axios.put(`/api/watchlists/${listId}`, {
        movieId: movie.id,
        title: movie.title,
        posterPath: movie.poster_path,
      });
      alert('Saved!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };


  if (!movie) return <p className="text-white p-4">Loading movie...</p>;


  return (
    <div
      className="relative min-h-screen text-white"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/*  Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-80 z-0"></div>

      <div className="relative z-10 px-4 py-30">
        <div className="flex flex-col md:flex-row lg:flex-row gap-6 max-w-3xl mx-auto">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-full md:w-[300px] rounded shadow-lg"
          />

          <div>
            <h1 className="text-2xl md:text-4xl font-bold mb-2">{movie.title}</h1>
            <p className="text-gray-300 mb-4">{movie.release_date} | ⭐ {movie.vote_average}</p>
            <p className="mb-4 text-gray-200 text-sm md:text-base">{movie.overview}</p>

            <div className="flex flex-wrap gap-2">
              {movie.genres?.map((genre) => (
                <span key={genre.id} className="border border-gray-400 px-3 py-1 rounded-full text-sm">{genre.name}</span>
              ))}
            </div>

            <div className="flex gap-6 items-center">
              <WatchlistButton movie={movie} />
              <FavoriteButton movie={movie} />

              {userLists.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Save to Watchlist:</h3>
                  <div className="flex flex-wrap gap-2">
                    {userLists.map((list) => (
                      <button
                        key={list._id}
                        onClick={() => saveToList(list._id)}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
                      >
                        {list.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        <div className="w-md">
           {movie && <ReviewSection movieId={movie.id} token={token} />}
        </div>

        {trailerKey && (
          <div className="mt-16 px-10">
            <h2 className="text-xl font-semibold mb-2">Watch Trailer</h2>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                width="100%"
                height="300"
                src={`https://www.youtube.com/embed/${trailerKey}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}

        {relatedMovies.length > 0 && (
          <div className="mt-20 bg-[#2b2b2b] p-5 rounded-xl">
            <h2 className="text-2xl font-semibold mb-4">You Might Also Like</h2>
            <div className="flex overflow-x-auto gap-4 scrollbar-hide pb-4">
              {relatedMovies.map((movie) => {
                const isInWatchlist = watchlist.some((item) => item.id === movie.id);
                return (
                  <Link to={`/movie/${movie.id}`} key={movie.id}>
                    <div className="min-w-[150px] md:min-w-[180px] hover:scale-105 transition cursor-pointer">
                      <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="rounded-md w-full h-[225px] object-cover"
                      />
                      <p className="text-xs mt-1 text-center">{movie.title}</p>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleWatchlist(movie.id, isInWatchlist);
                        }}
                        className={`text-xs mt-2 px-2 py-1 rounded block mx-auto ${isInWatchlist
                          ? 'bg-gray-700 hover:bg-gray-600'
                          : 'bg-red-600 hover:bg-red-700'
                          }`}
                      >
                        {isInWatchlist ? '✓ Remove from Watchlist' : '+ Add to Watchlist'}
                      </button>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}



      </div>
    </div>
  );

};

export default MovieDetails;
