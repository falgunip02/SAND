import React, { useState, useEffect } from "react";
import PageTitle from "../../../../../components/PageTitles/PageTitle";
import axios from "axios";
import "./AssignCampaignToMis.css";
import { useParams } from "react-router-dom";

const AssignCampaignToMis = () => {
  const [Mis, setMis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
//   const [showForm, setShowForm] = useState(false);
//   const [promoterName, setPromoterName] = useState("");
//   const [promoterEmailId, setPromoterEmailId] = useState("");
//   const [password, setPassword] = useState("");

//   const { formId } = useParams();





  const fetchMis = async () => {
    try {
      const response = await axios.post(
        "https://sand-backend-kwqd.onrender.com/api/v1/admin/fetchUsersByRole",{
            role:"mis"
        }
      );
      if (response.status === 200) {


        // const promotersWithAssignment = response.data.data.map((promoter) => ({
        //   ...promoter,
        //   hasFormAssigned: promoter.forms.includes(formId),
        // }));
        setMis(response.data.data);
      } else {
        setError("Failed to fetch Mis.");
      }
    } catch (error) {
        console.log(error);
      setError("An error occurred while fetching Mis.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMis();
  }, []);

//   const assignFormToPromoter = async (promoterId) => {
//     try {
//       const response = await axios.post(
//         "https://sand-backend-kwqd.onrender.com/api/v1/admin/assignCreatedForms",
//         {
//           formId,
//           promoterId,
//         }
//       );

//       if (response.status === 200) {
//         alert("Form assigned successfully!");
//         setPromoters((prevPromoters) =>
//           prevPromoters.map((promoter) => {
//             if (promoter._id === promoterId) {
//               return {
//                 ...promoter,
//                 hasFormAssigned: true,
//               };
//             }
//             return promoter;
//           })
//         );
//       } else {
//         alert("Failed to assign form.");
//       }
//     } catch (error) {
//       alert("An error occurred while assigning the form.");
//     }
//   };

//   const unassignFormFromPromoter = async (promoterId) => {
//     try {
//       const response = await axios.post(
//         "https://sand-backend-kwqd.onrender.com/api/v1/admin/unassignCreatedForms",
//         {
//           formId,
//           promoterId,
//         }
//       );

//       if (response.status === 200) {
//         alert("Form unassigned successfully!");
//         setPromoters((prevPromoters) =>
//           prevPromoters.map((promoter) => {
//             if (promoter._id === promoterId) {
//               return {
//                 ...promoter,
//                 hasFormAssigned: false,
//               };
//             }
//             return promoter;
//           })
//         );
//       } else {
//         alert("Failed to unassign form.");
//       }
//     } catch (error) {
//       alert("An error occurred while unassigning the form.");
//     }
//   };

//   const handleCreatePromoter = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         "https://sand-backend-kwqd.onrender.com/api/v1/promoter/registerNewPromoter",
//         {
//           promoterName,
//           promoterEmailId,
//           password,
//         }
//       );
//       if (response.data && response.status === 200) {
//         alert(response.data.message || "Promoter created successfully!");
//         setPromoterName("");
//         setPromoterEmailId("");
//         setPassword("");
//         setShowForm(false);
//       } else {
//         setError("Failed to create promoter.");
//       }
//     } catch (error) {
//       setError("An error occurred while creating the promoter.");
//     }
//   };

  return (
    <div className="assignFormContainer">
      <div className="title">
        <PageTitle title="Assign Mis" />
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
                <th>Mis Name</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Mis.map((mis) => (
                <tr key={mis._id}>
                  <td>{mis.name}</td>
                  <td>{mis.email}</td>
                  <td>
                    {mis.hasFormAssigned ? (
                      <button
                        className="unassignFormBtn"
                        onClick={() => unassignFormFromPromoter(promoter._id)}
                      >
                        Revoke Form
                      </button>
                    ) : (
                      <button
                        className="assignFormBtn"
                        onClick={()=>{} }
                      >
                        Assign campaign
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

export default AssignCampaignToMis;