import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    const storedToken = localStorage.getItem('token');
    return storedToken ? jwtDecode(storedToken) : null;
  });

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        localStorage.setItem('token', token);
      } catch (err) {
        console.error("Error decoding token:", err);
        toast.error("Invalid or expired token");
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
      }
    } else {
      setUser(null);
      localStorage.removeItem('token');
    }
  }, [token]);


  const login = (newToken) => {
    console.log("Logging in with token:", newToken);
    setToken(newToken);
  };


  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.info('You have logged out!');
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
