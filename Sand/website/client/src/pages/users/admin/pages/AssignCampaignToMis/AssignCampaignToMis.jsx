import React, { useState, useEffect } from "react";
import PageTitle from "../../../../../components/PageTitles/PageTitle";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./AssignCampaignToMis.css";

const AssignCampaignToMis = () => {
  const [Mis, setMis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { campaignId } = useParams();

  useEffect(() => {
    const fetchMis = async () => {
      
      try {
        const response = await axios.post(
          "https://sand-backend-kwqd.onrender.com/api/v1/admin/fetchUsersByRole",
          { role: "mis" }
        );

        if (response.status === 200) {
          const misWithAssignment = response.data.data.map((mis) => ({
            ...mis,
            hasCampaignAssigned: mis.listOfCampaigns?.includes(campaignId) || false,
          }));

          setMis(misWithAssignment);
        } else {
          setError("Failed to fetch Mis.");
        }
      } catch (error) {
        console.error(error);
        setError("An error occurred while fetching Mis.");
      } finally {
        setLoading(false);
      }
    };

    fetchMis();
  }, []); // Runs when `campaign` is updated

  const assignCampaignToMis = async (misId) => {
    try {
      const response = await axios.post(
        "https://sand-backend-kwqd.onrender.com/api/v1/admin/assignCampaignToMis",
        { campaignId, misId }
      );

      if (response.status === 200) {
        alert("Mis assigned successfully!");
        setMis((prevMis) =>
          prevMis.map((mis) =>
            mis._id === misId ? { ...mis, hasCampaignAssigned: true } : mis
          )
        );
      } else {
        alert("Failed to assign campaign.");
      }
    } catch (error) {
      alert("An error occurred while assigning the campaign.");
    }
  };
  const unAssignCampaignToMis = async (misId) => {
    try {
      const response = await axios.post(
        "https://sand-backend-kwqd.onrender.com/api/v1/admin/unassignCampaignToMis",
        { campaignId, misId }
      );

      if (response.status === 200) {
        alert("Mis un assigned successfully!");

        
        setMis((prevMis) =>
          prevMis.map((mis) =>
            mis._id === misId ? { ...mis, hasCampaignAssigned: false } : mis
          )
        );
      } else {
        alert("Failed to unassign campaign.");
      }
    } catch (error) {
      alert("An error occurred while assigning the campaign.");
    }
  };

  return (
    <div className="assignFormContainer">
      <div className="title">
        <PageTitle title="Assign Mis" />
      </div>
      <div className="formDetails">
        {loading ? (
          <div className="loading">
            <p>Loading...</p>
          </div>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <table className="promoterTable">
            <thead>
              <tr>
                <th>Mis Name</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Mis.map((mis) => (
                <tr key={mis._id}>
                  <td>{mis.name}</td>
                  <td>{mis.email}</td>
                  <td>
                    {mis.hasCampaignAssigned ? (
                      <button className="unassignFormBtn" onClick={() => unAssignCampaignToMis(mis._id)}>
                        Remove Campaign
                      </button>
                    ) : (
                      <button
                        className="assignFormBtn"
                        onClick={() => assignCampaignToMis(mis._id)}
                      >
                        Assign Campaign
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AssignCampaignToMis;
