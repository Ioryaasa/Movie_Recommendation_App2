import React, { useState, useContext } from 'react';
import logo from '../assets/logo.png'; 
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import { toast } from 'react-toastify';

const Login = () => {
  const [signState, setSignState] = useState('Sign In');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (signState === 'Sign Up') {
        await axios.post('/api/auth/register', { username, email, password });

        toast.success('Registration successful. Please log in.');
        setSignState('Sign In'); // Switch to login form
      } else {
        const res = await axios.post('/api/auth/login', { email, password });
        console.log("Token received from backend:", res.data.token);
        login(res.data.token);
        toast.success('Login successful!');
        navigate('/');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong.');
    }
    setLoading(false);
  };

  return (
    <div className="login min-h-screen flex flex-col items-center justify-center bg-black px-4">
      <img src={logo} alt="Logo" className="login-logo w-32 mb-6" />
      <div className="login-form w-full max-w-md bg-slate-800 p-6 rounded shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">{signState}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {signState === 'Sign Up' && (
            <input
              type="text"
              id="username"
              placeholder="Your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          )}
          <input
            type="email"
            id="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="password"
            id="password"
            placeholder="Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
          >
            {loading ? 'Please wait...' : signState}
          </button>

          <div className="form-help flex justify-between text-sm text-gray-600 mt-2">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Remember Me
            </label>
            <p className="cursor-pointer hover:underline">Need help?</p>
          </div>
        </form>

        <div className="form-switch mt-4 text-center text-sm text-gray-700">
          {signState === 'Sign In' ? (
            <p>
              New to MovieBase?{' '}
              <span
                className="text-red-600 cursor-pointer hover:underline"
                onClick={() => setSignState('Sign Up')}
              >
                Sign Up Now
              </span>
            </p>
          ) : (
            <p>
              Already Have Account?{' '}
              <span
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() => setSignState('Sign In')}
              >
                Sign In Now
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
