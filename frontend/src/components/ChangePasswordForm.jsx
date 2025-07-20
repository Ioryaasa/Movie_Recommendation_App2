import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ChangePasswordForm = ({ token }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/api/users/change-password', {
        oldPassword,
        newPassword,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Password updated successfully');
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shadow rounded mt-6 ">
      <h2 className="text-lg font-semibold mb-4">Change Password</h2>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4"
>
        <input
          type="password"
          placeholder="Current Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
        >
          {loading ? 'Changing...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordForm;
