import React, { useEffect, useState } from "react";
import axios from "axios";
import PageTitle from "../../../../../components/PageTitles/PageTitle";
import "./AdminNestedViewData.css";
import FormBox from "../../../../../components/FormBox/FormBox";
import { useParams } from "react-router-dom";

const AdminNestedViewData = () => {
  const { formId } = useParams();
  const [forms, setForms] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNestedForms = async () => {
      try {
        const response = await axios.post(
          "https://sand-backend-kwqd.onrender.com/api/v1/admin/fetchnestedforms",
          { mainFormId: formId }
        );
        console.log("Response: ", response);
        if (response.data.success) {
          setForms(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError("Error fetching nested forms.");
      } finally {
        setLoading(false);
      }
    };

    if (formId) {
      fetchNestedForms();
    }
  }, [formId]);

  return (
    <div className="form-details">
      <PageTitle title="Nested Forms Details" />
      <div className="form-details-container">
        {loading ? (
          <p>Loading nested forms...</p>
        ) : error ? (
          <p>{error}</p>
        ) : forms.length > 0 ? (
          forms.map((form) => (
            <FormBox
              key={form._id}
              formId={forms._id}
              form={form}
            />
          ))
        ) : (
          <p>No nested forms available for this campaign.</p>
        )}
      </div>
    </div>
  );
};

export default AdminNestedViewData;