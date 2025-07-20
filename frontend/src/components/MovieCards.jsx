import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Mousewheel, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import WatchlistButton from './WatchlistButton';
import FavoriteButton from './FavoriteButton';




const MovieCards = ({ title, category }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axios.get(`/api/movies/category/${category}`);
        setMovies(res.data);
      } catch (err) {
        console.error(`Failed to load ${category} movies`, err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [category]);

  return (
    <div className="mb-6 px-4">
      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 text-white">{title}</h2>

      <Swiper
        spaceBetween={12}
        grabCursor={true}
        navigation={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        modules={[Navigation, Mousewheel, Autoplay]}
        breakpoints={{
          0: { slidesPerView: 2 }, 
          480: { slidesPerView: 3 }, 
          640: { slidesPerView: 4 }, 
          768: { slidesPerView: 5 },
          1024: { slidesPerView: 6 },
          1280: { slidesPerView: 7 },
        }}
        className="py-4"
      >
        {loading ? (
          <p className="text-sm text-gray-400 px-4">Loading {title}...</p>
        ) : (
          movies.map((movie) => (
            <SwiperSlide key={movie.id}>
              <Link to={`/movie/${movie.id}`}>
                <div className="hover:scale-105 transition-transform duration-200 ease-in-out">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-48 object-cover rounded shadow"
                  />
                  <div className="mt-2 px-1 text-white text-xs sm:text-sm flex flex-col items-center">
                    <p className="truncate text-center w-full">{movie.title}</p>
                    <div className="flex gap-2 justify-center mt-1">
                      <WatchlistButton movie={movie} />
                      <FavoriteButton movie={movie} />
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))
        )}
      </Swiper>
    </div>

  );
};

export default MovieCards;
