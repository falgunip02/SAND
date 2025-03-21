import React, { useState } from 'react';
import axios from 'axios';
import './SettingPage.css';
import { useParams } from 'react-router-dom';

const SettingPage = () => {
  const { id } = useParams(); // Fetch userId from URL parameters
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  console.log(id);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match.');
      return;
    }

    

    try {
      const response = await axios.post('https://sand-backend-kwqd.onrender.com/api/v1/user/changePassword', {
        id,
        currentPassword,
        newPassword,
      });
      if (response.status === 200) {
        setMessage('Password changed successfully.');
      } else {
        setMessage('Error changing password.');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage('Error changing password.');
    }
  };

  return (
    <div className="setting-page-container">
      <h1>Settings</h1>
      <form onSubmit={handleChangePassword}>
        <div className="form-group">
          <label>Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Change Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SettingPage;