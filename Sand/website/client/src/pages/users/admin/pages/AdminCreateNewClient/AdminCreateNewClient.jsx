import React, { useState , useEffect} from "react";
import axios from "axios";
import PageTitle from "../../../../../components/PageTitles/PageTitle";
import "./AdminCreateNewClient.css";
import { useParams } from "react-router-dom";

const AdminCreateNewClient = () => {
  const [clientName, setClientName] = useState("");
  const [clientLocation, setClientLocation] = useState("");
  const [clientWebsite, setClientWebsite] = useState("");
  const [clientPhoto, setClientPhoto] = useState(null); // New state for client photo
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");



  const { campaignId } = useParams();




  
  
    // useEffect(() => {
    //   if (!campaignId) {
    //     console.error("Campaign ID is missing");
    //   }
    // }, [campaignId]);

  const handleInputChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setClientPhoto(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!clientPhoto) {
      setError("Please upload Client Photo");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("clientName", clientName);
    formData.append("clientLocation", clientLocation);
    formData.append("clientWebsite", clientWebsite);
    formData.append("clientPhoto", clientPhoto); // Append file to form data

    try {
      const response = await axios.post(
        "https://sand-backend-kwqd.onrender.com/api/v1/admin/createNewClient",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 201) {
        const newClient = response.data.data;
        setSuccess(
          `Client created successfully: ${newClient.clientName} (ID: ${newClient._id})`
        );
        setClientName("");
        setClientLocation("");
        setClientWebsite("");
        setClientPhoto(null);
      }
    } catch (error) {
      setError("An error occurred while creating new client. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-new-client">
      <PageTitle title="Create New Client" />
      <div className="create-new-client-container">
        <h3 className="container-heading">Enter Client Details</h3>
        <form className="client-Form" onSubmit={handleSubmit}>
          <div className="inputFields">
            <input
              type="text"
              className="input-field"
              placeholder="Name of Client"
              value={clientName}
              onChange={handleInputChange(setClientName)}
              required
            />
            <input
              type="text"
              className="input-field"
              placeholder="Client Location"
              value={clientLocation}
              onChange={handleInputChange(setClientLocation)}
              required
            />
            <input
              type="text"
              className="input-field"
              placeholder="Client Website"
              value={clientWebsite}
              onChange={handleInputChange(setClientWebsite)}
              required
            />
          </div>
          <div className="file-upload">
            <input
              type="file"
              id="file-upload"
              className="file-upload-input"
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload" className="file-upload-label">
              {clientPhoto ? clientPhoto.name : "Upload Client Logo"}
            </label>
          </div>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Creating..." : "Create Client"}
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </div>
    </div>
  );
};

export default AdminCreateNewClient;
