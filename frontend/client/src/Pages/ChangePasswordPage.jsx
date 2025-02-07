import React, { useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';

const ChangePasswordPage = () => {
  const [oldUsername, setOldUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [prevPassword, setPrevPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prevPassword || !newPassword || !confirmPassword) {
      setMessage('All fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage('New password and confirmation do not match.');
      return;
    }

    try {
      const payload = oldUsername ? { newUsername, prevPassword, newPassword } : { prevPassword, newPassword };
      const endpoint = oldUsername ? `http://localhost:5000/change_credentials/${oldUsername}` : `http://localhost:5000/change_password`;

      const response = await axios.put(endpoint, payload);
      setMessage(response.data.message);
      setOldUsername('');
      setNewUsername('');
      setPrevPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error updating credentials.');
    }
  };

  return (
    <>
      <Header />
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="w-[400px] p-6 bg-white rounded-lg shadow-md"
        >
          <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
            {oldUsername ? 'Change Username & Password' : 'Change Password'}
          </h2>

          {oldUsername !== undefined && (
            <div className="mb-4">
              <label className="block mb-1 font-medium text-center">Old Username</label>
              <input
                type="text"
                value={oldUsername}
                onChange={(e) => setOldUsername(e.target.value)}
                className="w-full p-2 border rounded text-center"
              />
            </div>
          )}

          {oldUsername !== undefined && (
            <div className="mb-4">
              <label className="block mb-1 font-medium text-center">New Username</label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full p-2 border rounded text-center"
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block mb-1 font-medium text-center">Previous Password</label>
            <input
              type="password"
              value={prevPassword}
              onChange={(e) => setPrevPassword(e.target.value)}
              className="w-full p-2 border rounded text-center"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium text-center">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded text-center"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium text-center">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded text-center"
            />
          </div>

          {message && (
            <div
              className={`mb-4 text-center font-medium ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {oldUsername ? 'Change Username & Password' : 'Change Password'}
          </button>
        </form>
      </div>
    </>
  );
};

export default ChangePasswordPage;
