import React, { useState, useEffect } from "react";
import axios from "axios";
import "./OverViewTileTwoBox.css";
import OverViewTileTwoBox from "./OverViewTileTwoBox";

const OverViewTileTwo = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get(
          "https://sand-backend-kwqd.onrender.com/api/v1/admin/fetchLastCampaigns"
        );
        setCampaigns(response.data.data); // Assuming the response structure is { data: { data: campaigns } }
        setLoading(false);
      } catch (error) {
        setError("Error fetching campaigns");
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="OverViewTileTwoContainer">
      {campaigns.map((campaign) => (
        <OverViewTileTwoBox
          id={campaign._id}
          key={campaign._id}
          title={campaign.title}
          details={campaign.details}
          // setActiveTab={setActiveTab}
        />
      ))}
    </div>
  );
};

export default OverViewTileTwo;
