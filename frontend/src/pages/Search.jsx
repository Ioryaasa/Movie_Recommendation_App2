import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { Link, useSearchParams } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';

const Search = () => {
  const [results, setResults] = useState([]);
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      const res = await axios.get(`/api/movies/search?q=${query}`);
      setResults(res.data);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  useEffect(() => {
  const autoSearch = async () => {
    if (initialQuery) {
      const res = await axios.get(`/api/movies/search?q=${initialQuery}`);
      setResults(res.data);
    }
  };
  autoSearch();
}, [initialQuery]);

  return (
    <div className="min-h-screen bg-black text-white px-4 py-20">
      <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-xl mx-auto mb-8">
        <input
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-4 py-2 rounded bg-zinc-800 text-white focus:outline-none"
        />
        <button className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 flex items-center gap-2">
          <FiSearch /> Search
        </button>
      </form>

      {results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {results.map((movie) => (
            <Link to={`/movie/${movie.id}`} key={movie.id}>
              <div className="hover:scale-105 transition duration-200 ease-in-out">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="rounded w-full h-[250px] object-cover"
                />
                <p className="text-sm mt-2 text-center truncate">{movie.title}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        query && <p className="text-center text-gray-400">No results found for “{query}”</p>
      )}
    </div>
  );
};

export default Search;
