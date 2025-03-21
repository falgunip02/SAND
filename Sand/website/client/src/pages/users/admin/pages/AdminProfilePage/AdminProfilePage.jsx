import React, { useState, useEffect } from "react";
import PageTitle from "../../../../../components/PageTitles/PageTitle";
import { useNavigate, useParams } from "react-router-dom";
import { Settings } from "lucide-react"; // Import settings icon
import "./AdminProfilePage.css";

const AdminProfilePage = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [passwordMessage, setPasswordMessage] = useState(""); // Added missing state
  const navigate = useNavigate(); // Define navigate
  const { id } = useParams();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch("https://sand-backend-kwqd.onrender.com/api/v1/user/userDetails", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        const data = await response.json();
        if (response.ok) {
          setUserDetails(data.data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("An error occurred while fetching user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await fetch("https://sand-backend-kwqd.onrender.com/api/v1/user/changePassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();
      setPasswordMessage(data.success ? "Password changed successfully." : data.message || "Error changing password.");
    } catch (error) {
      console.error("Error changing password:", error);
      setPasswordMessage("Error changing password.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="adminProfilePage-container">
      <PageTitle title="Profile" />

      {/* Settings Button on the Right */}
      {/* 2. : since in my admin page I have written profile/settingPage this direct navigate to settingPage is the best approach */}
      <button className="settingsButton" onClick={() => navigate(`settingPage`)}>
        <Settings size={24} />
      </button>

      <div className="profile-container">
        <h1 className="userDetailsTitle">User Details</h1>

        {userDetails && (
          <div className="user-details">
            <p><strong>Name:</strong> {userDetails.name}</p>
            <p><strong>Surname:</strong> {userDetails.surname}</p>
            <p><strong>Email:</strong> {userDetails.email}</p>
            <p><strong>Role:</strong> {userDetails.role}</p>
            <p><strong>Created At:</strong> {new Date(userDetails.createdAt).toLocaleString()}</p>
            <p><strong>Updated At:</strong> {new Date(userDetails.updatedAt).toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProfilePage;
