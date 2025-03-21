import React, { useState, useEffect } from "react";
import PageTitle from "../../../../../components/PageTitles/PageTitle";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./AssignClientToManager.css";

const AssignClientToManager = () => {
  const [Manager, setManager] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { clientId } = useParams();

  useEffect(() => {
    const fetchManager = async () => {
      
      try {
        const response = await axios.post(
          "https://sand-backend-kwqd.onrender.com/api/v1/admin/fetchUsersByRole",
          { role: "manager" }
        );

        if (response.status === 200) {
          const managerWithAssignment = response.data.data.map((manager) => ({
            ...manager,
            hasClientAssigned: manager.listOfClient?.includes(clientId) || false,
          }));

          setManager(managerWithAssignment);
        } else {
          setError("Failed to fetch Manager.");
        }
      } catch (error) {
        console.error(error);
        setError("An error occurred while fetching Manager.");
      } finally {
        setLoading(false);
      }
    };

    fetchManager();
  }, []); // Runs when `campaign` is updated

  const AssignClientToManager = async (managerId) => {
    try {
      const response = await axios.post(
        "https://sand-backend-kwqd.onrender.com/api/v1/admin/assignClientToManager",
        { clientId, managerId }
      );

      if (response.status === 200) {
        alert("Manager assigned successfully!");
        setManager((prevManager) =>
          prevManager.map((manager) =>
            manager._id === managerId ? { ...manager, hasClientAssigned: true } : manager
          )
        );
      } else {
        alert("Failed to assign campaign.");
      }
    } catch (error) {
      alert("An error occurred while assigning the campaign.");
    }
  };
  const unAssignClientToManager = async (managerId) => {
    try {
      const response = await axios.post(
        "https://sand-backend-kwqd.onrender.com/api/v1/admin/unassignClientToManager",
        { clientId, managerId }
      );

      if (response.status === 200) {
        alert("Manager un assigned successfully!");

        
        setManager((prevManager) =>
          prevManager.map((manager) =>
            manager._id === managerId ? { ...manager, hasClientAssigned: false } : manager
          )
        );
      } else {
        alert("Failed to unassign Client.");
      }
    } catch (error) {
      alert("An error occurred while assigning the client.");
    }
  };

  return (
    <div className="assignFormContainer">
      <div className="title">
        <PageTitle title="Assign Manager" />
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
                <th>Manager Name</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Manager.map((manager) => (
                <tr key={manager._id}>
                  <td>{manager.name}</td>
                  <td>{manager.email}</td>
                  <td>
                    {manager.hasClientAssigned ? (
                      <button className="unassignFormBtn" onClick={() => unAssignClientToManager(manager._id)}>
                        Remove Client
                      </button>
                    ) : (
                      <button
                        className="assignFormBtn"
                        onClick={() => AssignClientToManager(manager._id)}
                      >
                        Assign Client
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

export default AssignClientToManager;
