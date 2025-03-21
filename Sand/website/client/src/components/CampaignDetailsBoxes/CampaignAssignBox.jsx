import React, { useState, useEffect } from 'react';
import './CampaignAssignBox.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CampaignAssignBox = ({ campaignId, title, imgSrc }) => {
  const [misUsers, setMisUsers] = useState([]);
  const [selectedMisId, setSelectedMisId] = useState("");
  const [message, setMessage] = useState("");


  const handleAssign = async () => {
    try {
      const response = await axios.post("https://sand-backend-kwqd.onrender.com/api/v1/admin/assignCampaign", {
        campaignId,
        misId: selectedMisId,
      });

      if (response.data.success) {
        setMessage("Campaign assigned to MIS user successfully");
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage("Error assigning campaign to MIS user");
      console.error("Error:", error);
    }
  };

  return (
    <div className="campaign-assign-box">
      <div className="icon-box">
        <img src={imgSrc} alt="" />
      </div>
      <div className="assign-container">
        <h3>{title}</h3>
        <select
          value={selectedMisId}
          onChange={(e) => setSelectedMisId(e.target.value)}
        >
          <option value="">Select MIS User</option>
          {misUsers.map((user) => (
            <option key={user._id} value={user._id}>
              {user.email}
            </option>
          ))}
        </select>
        <button onClick={handleAssign}>Assign</button>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default CampaignAssignBox;