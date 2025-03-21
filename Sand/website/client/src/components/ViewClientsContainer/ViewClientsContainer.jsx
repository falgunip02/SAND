import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ViewClientsContainer.css";
import ViewClientsBox from "./ViewClientsBox";
import {useParams} from "react-router-dom";
const ViewClientsContainer = ({ role }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {id} = useParams();

  const fetchClients = async () => {
    try {
      const response = await axios.get(
        "https://sand-backend-kwqd.onrender.com/api/v1/admin/fetchAllClient"
      );
      setClients(response.data.data.reverse());
      setLoading(false);
    } catch (err) {
      console.error("Error fetching clients:", err);
      setError("Failed to load clients");
      setLoading(false);
    }
  };


  const fetchClientsForManager = async () => {
    try {
      console.log(id);
      const response = await axios.post(
        "https://sand-backend-kwqd.onrender.com/api/v1/manager/fetchManagerClients",{
          managerId:id,
        }
      );
      setClients(response.data.data.reverse());
      setLoading(false);
    } catch (err) {
      console.error("Error fetching clients:", err);
      setError("Failed to load clients");
      setLoading(false);
    }
  };

  useEffect(() => {
   if (role === "admin") {
     fetchClients() } else{
      fetchClientsForManager();
     }
    }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="ViewClientsContainer">
      {clients.map((client, index) => (
        <ViewClientsBox
          key={index}
          imgSrc={client["clientPhoto"]}
          clientName={client["clientName"]}
          clientId={client["_id"]}
        />
      ))}
    </div>
  );
};

export default ViewClientsContainer;
