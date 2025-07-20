import { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiUser } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext'; 
import logo from '../assets/logo.png'; 

const Navbar = () => {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const profileRef = useRef();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => setIsOpen(false);

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-black text-white fixed top-0 w-full z-50 shadow-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
          <img src={logo} alt="Logo" className="h-8 w-auto" />
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center gap-2">
          <input
            type="text"
            placeholder="Search"
            className="bg-zinc-800 text-white px-3 py-1 rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition">Go</button>
        </form>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6 text-sm">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/watchlists" className="hover:text-gray-300">My Watchlists</Link>
           {user && (
            <Link to="/favorites" className="text-white hover:text-red-400">
              Favorites
            </Link>
          )}
          <Link to="/search" className="hover:text-gray-300">Search</Link>

          {isAuthenticated ? (
            <div className="relative" ref={profileRef}>
              <button onClick={toggleProfileMenu} className="flex items-center space-x-2">
                <FiUser className="text-xl" />
                <span className="hidden sm:inline">{user?.name || 'User'}</span>
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-md overflow-hidden animate-fade-in z-50">
                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="hover:text-blue-400 border px-3 py-1 rounded border-blue-500">Login</Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white text-2xl">
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3 bg-black text-sm border-t border-gray-800 animate-fade-in">
          <Link to="/" onClick={closeMenu} className="block hover:text-gray-300">Home</Link>
          <Link to="/watchlists" onClick={closeMenu} className="block hover:text-gray-300">My Watchlists</Link>
          
          {user && (
            <Link to="/favorites" className="text-white hover:text-red-400">
              Favorites
            </Link>
          )}

          <Link to="/search" onClick={closeMenu} className="block hover:text-gray-300">Search</Link>

          {isAuthenticated ? (
            <>
              <Link to="/profile" onClick={closeMenu} className="block hover:text-gray-300">Profile</Link>
              <button onClick={() => { handleLogout(); closeMenu(); }} className="block text-left text-red-400 border px-3 py-1 rounded border-red-500">Logout</button>
            </>
          ) : (
            <Link to="/login" onClick={closeMenu} className="block text-blue-400 border px-3 py-1 rounded border-blue-500 w-fit">Login</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
