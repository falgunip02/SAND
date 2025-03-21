import React, { useEffect, useState } from "react";
import axios from "axios";
import PageTitle from "../../../../../components/PageTitles/PageTitle";
import "./AdminFormDetails.css";
import FormBox from "../../../../../components/FormBox/FormBox";
import { useParams } from "react-router-dom";



const AdminFormDetails = () => {
  const { campaignId } = useParams();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //const fetchnestedform  same as fetchform



  useEffect(() => {
    //call if else if url contains "fetchnestedforms" call this or fetchforms. 
    const fetchForms = async () => {
      try {
        const response = await axios.post(
          "https://sand-backend-kwqd.onrender.com/api/v1/admin/fetchFormsForGivenClient",
          { campaignId }
        );
        setForms(response.data.data.reverse());
        setLoading(false);
      } catch (err) {
        setError("Error fetching forms.");
        setLoading(false);
      }
    };


    const fetchNestedForm = async () => {
      
    }



    if (campaignId) {
      fetchForms();
    }
  }, [campaignId]);

  return (
    <div className="form-details">
      <PageTitle title="All Forms Details" />
      <div className="form-details-container">
        {loading ? (
          <p>Loading forms...</p>
        ) : error ? (
          <p>{error}</p>
        ) : forms.length > 0 ? (
          forms.map((form) => {
            if (!form.isThisNestedForm) {
              return (<FormBox
                key={form._id}
                formId={form._id}
                form={form}
              // setActiveTab={setActiveTab}
              />)
            }
          })
        ) : (
          <p>No forms available for this campaign.</p>
        )}
      </div>
    </div>
  );
};

export default AdminFormDetails;
