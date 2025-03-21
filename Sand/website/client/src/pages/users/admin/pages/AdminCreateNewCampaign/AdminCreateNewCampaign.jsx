import React, { useState } from "react";
import axios from "axios";
import PageTitle from "../../../../../components/PageTitles/PageTitle";
import "./AdminCreateNewCampaign.css";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const AdminCreateNewCampaign = ({ setActiveTab }) => {
  const { clientId } = useParams();

  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [campaignId, setId] = useState("");
  const [campaignPhoto, setCampaignPhoto] = useState(null);

  const navigate = useNavigate();

  const handleInputChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setCampaignPhoto(file);
  };

  const handleNextClick = () => {
    navigate(`/admin/createNewForm/${campaignId}`);
    if (setActiveTab && typeof setActiveTab === "function") {
      setActiveTab("CreateForm");
    } else {
      console.warn("setActiveTab is not provided or is not a function.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!campaignPhoto) {
      setError("Please upload Campaign Photo");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("clientId", clientId);
      formData.append("campaignPhoto", campaignPhoto);

      const response = await axios.post(
        "https://sand-backend-kwqd.onrender.com/api/v1/admin/createNewCampaign",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        const newCampaign = response.data.data;
        setSuccess(
          "Campaign created successfully: ${newCampaign.title} (ID: ${newCampaign._id}"
        );
        setTitle("");
        setId(newCampaign._id);
        setCampaignPhoto(null); // Clear photo after successful upload
      }
    } catch (error) {
      setError(
        "An error occurred while creating the new campaign. Try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-new-campaign">
      <PageTitle title="Create New Campaign" />
      <div className="create-new-campaign-container">
        <h3 className="container-heading">Enter Campaign Details</h3>
        <form className="campaign-form" onSubmit={handleSubmit}>
          <div className="inputFields">
            <input
              type="text"
              className="campaigninput-field"
              placeholder="Campaign Title"
              value={title}
              onChange={handleInputChange(setTitle)}
              required
            />
            <div className="file-upload">
              <input
                type="file"
                id="campaign-photo-upload"
                className="file-upload-input"
                onChange={handleFileChange}
              />
              <label
                htmlFor="campaign-photo-upload"
                className="file-upload-label"
              >
                {campaignPhoto ? campaignPhoto.name : "Upload Campaign Photo"}
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="submit-campaign-button"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Campaign"}
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        {success && (
          <input
            type="button"
            value="Generate Form"
            className="submit-campaign-button"
            onClick={handleNextClick}
          />
        )}
      </div>
    </div>
  );
};

export default AdminCreateNewCampaign;