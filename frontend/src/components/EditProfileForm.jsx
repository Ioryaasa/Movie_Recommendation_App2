import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

const EditProfileForm = ({ token }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setEmail(decoded.email || '');
      setUsername(decoded.username || '');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const decoded = jwtDecode(token);

      await axios.put(`/api/users/${decoded.id}`, {
        email,
        username
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shadow rounded mt-6">
      <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="p-2 border rounded"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="p-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default EditProfileForm;
