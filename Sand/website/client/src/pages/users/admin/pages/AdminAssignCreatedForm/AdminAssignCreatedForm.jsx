import React, { useState, useEffect } from "react";
import PageTitle from "../../../../../components/PageTitles/PageTitle";
import axios from "axios";
import "./AdminAssignCreatedForm.css";
import { useNavigate, useParams } from "react-router-dom";

const AdminAssignCreatedForm = () => {
  const [promoters, setPromoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [promoterName, setPromoterName] = useState("");
  const [promoterEmailId, setPromoterEmailId] = useState("");
  const [password, setPassword] = useState("");

  const { formId } = useParams();
  const { campaignId } = useParams();
  const navigate = useNavigate();

  const fetchPromoters = async () => {
    try {
      const response = await axios.get(
        "https://sand-backend-kwqd.onrender.com/api/v1/promoter/fetchPromoters"
      );
      if (response.status === 200) {
        const promotersWithAssignment = response.data.data.map((promoter) => ({
          ...promoter,
          hasFormAssigned: promoter.forms.includes(formId),
        }));
        setPromoters(promotersWithAssignment);
      } else {
        setError("Failed to fetch promoters.");
      }
    } catch (error) {
      setError("An error occurred while fetching promoters.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromoters();
  }, [formId]);
//handled back button issue
  useEffect(() => {
    const handlePopState = () => {
      navigate(`/admin/campaignDetailsPage/${campaignId}`, { replace: true });
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate, campaignId]);

  const assignFormToPromoter = async (promoterId) => {
    try {
      const response = await axios.post(
        "https://sand-backend-kwqd.onrender.com/api/v1/admin/assignCreatedForms",
        {
          formId,
          promoterId,
        }
      );

      if (response.status === 200) {
        alert("Form assigned successfully!");
        setPromoters((prevPromoters) =>
          prevPromoters.map((promoter) => {
            if (promoter._id === promoterId) {
              return {
                ...promoter,
                hasFormAssigned: true,
              };
            }
            return promoter;
          })
        );
      } 
      else {
        alert("Failed to assign form.");
      }
    } catch (error) {
      alert("An error occurred while assigning the form.");
    }
  };

  const unassignFormFromPromoter = async (promoterId) => {
    try {
      const response = await axios.post(
        "https://sand-backend-kwqd.onrender.com/api/v1/admin/unassignCreatedForms",
        {
          formId,
          promoterId,
        }
      );

      if (response.status === 200) {
        alert("Form unassigned successfully!");
        setPromoters((prevPromoters) =>
          prevPromoters.map((promoter) => {
            if (promoter._id === promoterId) {
              return {
                ...promoter,
                hasFormAssigned: false,
              };
            }
            return promoter;
          })
        );
      } else {
        alert("Failed to unassign form.");
      }
    } catch (error) {
      alert("An error occurred while unassigning the form.");
    }
  };

  const handleCreatePromoter = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://sand-backend-kwqd.onrender.com/api/v1/promoter/registerNewPromoter",
        {
          promoterName,
          promoterEmailId,
          password,
        }
      );
      if (response.data && response.status === 200) {
        alert(response.data.message || "Promoter created successfully!");
        setPromoterName("");
        setPromoterEmailId("");
        setPassword("");
        setShowForm(false);
      } else {
        setError("Failed to create promoter.");
      }
    } catch (error) {
      setError("An error occurred while creating the promoter.");
    }
  };

  return (
    <div className="assignFormContainer">
      <div className="title">
        <PageTitle title="Assign Promoters" />
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
                <th>Promoter Name</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {promoters.map((promoter) => (
                <tr key={promoter._id}>
                  <td>{promoter.promoterName}</td>
                  <td>{promoter.promoterEmailId}</td>
                  <td>
                    {promoter.hasFormAssigned ? (
                      <button
                        className="unassignFormBtn"
                        onClick={() => unassignFormFromPromoter(promoter._id)}
                      >
                        Revoke Form
                      </button>
                    ) : (
                      <button
                        className="assignFormBtn"
                        onClick={() => assignFormToPromoter(promoter._id)}
                      >
                        Assign Form
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button
          className="create-promoter-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Create New Promoter"}
        </button>

        {showForm && (
          <div className="promoter-form">
            <form onSubmit={handleCreatePromoter}>
              <div className="form-group">
                <input
                  type="text"
                  id="promoterName"
                  className="inputField"
                  placeholder="Promoter Name"
                  value={promoterName}
                  onChange={(e) => setPromoterName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  id="promoterEmailId"
                  className="inputField"
                  placeholder="Promoter Email"
                  value={promoterEmailId}
                  onChange={(e) => setPromoterEmailId(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  id="password"
                  className="inputField"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="createPromotersubmit-btn">
                  Create Promoter
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAssignCreatedForm;