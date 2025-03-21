import React, { useState, useEffect } from "react";
import "./OverViewTileOne.css";
import axios from "axios";
import OverViewTileOneBox from "./OverViewTileOneBox";

const OverViewTileOne = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [data, setData] = useState({
    numberOfClients: 0,
    numberOfCampaigns: 0,
  });

  const initialFetch = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.get(
        "https://sand-backend-kwqd.onrender.com/api/v1/admin/fetchNumberOfClientsAndCampaigns"
      );

      if (response.status === 200) {
        const fetchedData = response.data.data;
        setData(fetchedData);
        setSuccess(
          `Number of clients: ${fetchedData.numberOfClients}, Number of campaigns: ${fetchedData.numberOfCampaigns}`
        );
      } else {
        setError("Failed to fetch the number of clients and campaigns.");
      }
    } catch (error) {
      setError("An error occurred while fetching data. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initialFetch();
  }, []);

  return (
    <div className="OverViewTileOneContainer">
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {success && (
        <>
          <OverViewTileOneBox
            title="TOTAL CLIENTS"
            number={data.numberOfClients}
          ></OverViewTileOneBox>
          <OverViewTileOneBox
            title="TOTAL CAMPAIGNS"
            number={data.numberOfCampaigns}
          ></OverViewTileOneBox>
          <OverViewTileOneBox
            title="GENERATED FORMS"
            number={data.numberOfForms}
          ></OverViewTileOneBox>
          <OverViewTileOneBox
            title="TOTAL PROMOTERS"
            number={data.numberOfPromoters}
          ></OverViewTileOneBox>
        </>
      )}
    </div>
  );
};

export default OverViewTileOne;
