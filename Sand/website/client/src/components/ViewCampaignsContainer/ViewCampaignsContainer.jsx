import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./ViewCampaignsContainer.css";
import ViewCampaignsBox from "./ViewCampaignsBox";

const ViewCampaignsContainer = ({ role }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { clientId, id } = useParams();

  const fetchAdminCampaigns = async () => {
    try {
      const response = await axios.post(
        "https://sand-backend-kwqd.onrender.com/api/v1/admin/fetchAllCampaigns",
        { clientId }
      );
      setCampaigns(response.data.data.reverse());
      setLoading(false);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      setError("Failed to load campaigns");
      setLoading(false);
    }
  };

  const fetchMisCampaigns = async () => {
    try {
      console.log(id);

      const response = await axios.post(
        "https://sand-backend-kwqd.onrender.com/api/v1/mis/fetchMisCampaigns",
        { misId: id }
      );
      console.log(response);

      setCampaigns(response.data.data.reverse());
      setLoading(false);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      setError("Failed to load campaigns");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === "admin"|| role === "manager") {
      console.log("admin wala");

      fetchAdminCampaigns();
    } else {
      console.log("mis wala");

      fetchMisCampaigns();
    }
  }, [role]); // Dependency added

  const handleDeleteClient = async () => {
    try {
      const response = await axios.delete(
        "https://sand-backend-kwqd.onrender.com/api/v1/admin/deleteClient",
        {
          data: { clientId },
        }
      );

      if (response.status === 200) {
        alert("Client deleted successfully.");
        // Remove setActiveTab if it's not defined
        // setActiveTab("viewClients");
      }
    } catch (error) {
      console.error("Error deleting client:", error);
      alert("Failed to delete client");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="viewCampaignsContainer">
      {(role === "admin" || role === "manager") && (
        <>
          <input
            className="newCampaignBtn"
            type="button"
            value="Create New Campaign"
            onClick={() => navigate('AdminCreateNewCampaign')}
          />
          
        </>
      )}

      {(role === "admin" ) && (<>
        <input
        className="newCampaignBtn"
        type="button"
        value="Assign Client To Manager"
        onClick={() => navigate(`/admin/AssignClientToManager/${clientId}`)}
      /> 
      <input
            className="deleteClientBtn"
            type="button"
            value="Delete Client"
            onClick={handleDeleteClient}
          />
      </>
      )} 

      <div className="allCampaignsContainer">
        {campaigns.map((campaign) => (
          <ViewCampaignsBox
            key={campaign._id}
            url={campaign.campaignLogo}
            campaign={campaign}
            campaignId={campaign._id}
          />
        ))}
      </div>
    </div>
  );
};

export default ViewCampaignsContainer;
