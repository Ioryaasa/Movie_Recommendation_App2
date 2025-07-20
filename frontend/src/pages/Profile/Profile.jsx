import React, { useEffect, useState } from "react";
import axios from "../../axiosConfig";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Profile = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [editForm, setEditForm] = useState({ username: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "" });
  const [isEditing, setIsEditing] = useState(false);



  useEffect(() => {
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      console.log("Decoded token:", decoded);
      fetchUserInfo(decoded.id);
      fetchWatchlist();
      fetchFavorites();
    } catch (err) {
      toast.error("Failed to decode token");
    }
  }, [token]);

  useEffect(() => {
    if (favorites.length > 0 && favorites[0]?.movies?.length > 0) {
      console.log("Favorites loaded:", favorites);
      favorites[0].movies.forEach((movie) => {
        console.log("Movie:", movie);
      });
    }
  }, [favorites]);

  const fetchWatchlist = async () => {
    try {
      const res = await axios.get("/api/watchlists", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWatchlist(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error("Failed to load watchlist");
    }
  };

  const fetchFavorites = async () => {
    try {
      const res = await axios.get("/api/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error("Failed to load favorites");
    }
  };

  const fetchUserInfo = async (userId) => {
    try {
      const res = await axios.get(`/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;
      console.log("User data from API:", res.data);
      setUser(data);
      setEditForm({ username: data.username || "", email: data.email || "" });
    } catch (err) {
      toast.error("Failed to fetch user info");
    }
  };


  const handleProfileUpdate = async () => {
    try {
      await axios.put(`/api/users/${user.id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Updating user ID:", user);
      toast.success("Profile updated");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handlePasswordChange = async () => {
    try {
      await axios.post("/api/users/change-password", passwordForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Password changed");
    } catch (err) {
      toast.error("Password change failed");
    }
  };

  const handleDeleteAccount = async () => {
    const confirm = window.confirm("Are you sure you want to delete your account?");
    if (!confirm) return;
    try {
      await axios.delete(`/api/users/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem("token");
      toast.success("Account deleted");
      navigate("/login");
    } catch (err) {
      toast.error("Failed to delete account");
    }
  };

  if (!user) return <p className="text-center text-white">Loading profile...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 text-white">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.username || "User"}</h1>

      {!isEditing ? (
        <div>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <button onClick={() => setIsEditing(true)}>Edit Info</button>
        </div>
      ) : (
        <div className="space-y-4 bg-gray-900 p-4 rounded-lg mt-6">
          <h2 className="text-xl font-semibold text-white border-b border-gray-600 pb-2">Personal Information</h2>

          <label className="block text-sm font-medium text-gray-300">Username</label>
          <input
            type="text"
            value={editForm.username}
            onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
          />

          <label className="block text-sm font-medium text-gray-300">Email</label>
          <input
            type="email"
            value={editForm.email}
            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
          />

          <button
            onClick={handleProfileUpdate}
            className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded text-white"
          >
            Save Changes
          </button>
        </div>
      )}

      <div className="space-y-4 mt-6 bg-gray-800 p-4 rounded-lg">
        <h2 className="text-xl font-semibold">Change Password</h2>
        <input
          type="password"
          value={passwordForm.oldPassword}
          onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
          placeholder="Old Password"
          className="w-full p-2 text-white rounded"
        />
        <input
          type="password"
          value={passwordForm.newPassword}
          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
          placeholder="New Password"
          className="w-full p-2 text-black rounded"
        />
        <button onClick={handlePasswordChange} className="bg-yellow-600 px-4 py-2 rounded">
          Change Password
        </button>
      </div>

      <div className="mt-6">
        <button onClick={handleDeleteAccount} className="bg-red-600 px-4 py-2 rounded">
          Delete Account
        </button>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold">Watchlist</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
          {watchlist.length > 0 && watchlist[0].movies?.length > 0 ? (
            watchlist[0].movies.map((movie, index) => (
              <div key={`${movie.movieId}-${index}`} className="bg-gray-900 rounded shadow p-2">
                <img
                  src={
                    movie.posterPath
                      ? `https://image.tmdb.org/t/p/w200${movie.posterPath}`
                      : "/fallback.jpg"
                  }
                  alt={movie.title}
                  className="w-full rounded"
                />
                <p className="text-white text-sm text-center mt-1">{movie.title}</p>
              </div>
            ))
          ) : (
            <p>No watchlist items.</p>
          )}



        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold">Favorites</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
          {favorites.length > 0 ? (
            favorites.map((movie, index) => {
              console.log("🎬 Favorite Movie:", movie);
              return (
                <div key={`${movie.movieId}-${index}`} className="bg-gray-900 rounded shadow p-2">
                  <img
                    src={
                      movie.posterPath
                        ? `https://image.tmdb.org/t/p/w200${movie.posterPath}`
                        : "/fallback.jpg"
                    }
                    alt={movie.title}
                    className="w-full rounded"
                  />
                  <p className="text-gray-200 text-sm text-center mt-1">{movie.title}</p>
                </div>
              );
            })
          ) : (
            <p>No favorite movies.</p>
          )}



        </div>
      </div>
    </div>
  );
};

export default Profile;
