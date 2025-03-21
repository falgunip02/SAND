import React, { useState, useEffect } from "react";
import PageTitle from "../../../../components/PageTitles/PageTitle";
import "./ManagerProfilePage.css";
import { useParams } from "react-router-dom";

const ManagerProfilePage = () => {
  // Updated to accept userId as a prop
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {id} = useParams();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(
          "https://sand-backend-kwqd.onrender.com/api/v1/user/userDetails",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }), // Send id from the URL
          }
        );
  
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
  }, [id]); // Include id as a dependency
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="MisProfilePage-container">
      <PageTitle title="Profile" />
      <div className="profile-container">
        <h1 className="userDetailsTitle">User Details</h1>
        {userDetails && (
          <div className="user-details">
            <p>
              <strong>Name:</strong> {userDetails.name}
            </p>
            <p>
              <strong>Surname:</strong> {userDetails.surname}
            </p>
            <p>
              <strong>Email:</strong> {userDetails.email}
            </p>
            <p>
              <strong>Role:</strong> {userDetails.role}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(userDetails.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Updated At:</strong>{" "}
              {new Date(userDetails.updatedAt).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerProfilePage;
