import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageTitle from "../../../../../components/PageTitles/PageTitle";
import "./AdminRejectedData.css";

const AdminRejectedData = () => {
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  const { formId } = useParams();

  useEffect(() => {
    fetchData();
  }, [formId]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://sand-backend-kwqd.onrender.com/api/v1/promoter/fetchFormFilledData",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ formId }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        setFormData(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const updateAcceptedData = async (itemId, accepted) => {
    try {
      const response = await fetch(
        "https://sand-backend-kwqd.onrender.com/api/v1/admin/updateAcceptedData",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            formId: formId,
            itemId: itemId,
            acceptData: accepted,
          }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        fetchData();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Error updating data");
    }
  };

  const handleAccept = (itemId) => {
    updateAcceptedData(itemId, true);
  };

  const handleReject = (itemId) => {
    updateAcceptedData(itemId, false);
  };

  const renderTableHeaders = () => {
    if (formData.length === 0) return null;

    const keys = Object.keys(formData[0]);
    const filteredKeys = keys.filter((key) => key !== "_id");
    return (
      <>
        {filteredKeys.map((key) => (
          <th key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</th>
        ))}
      </>
    );
  };

  const renderTableRows = () => {
    const rejectedData = formData.filter((item) => !item.acceptedData);

    return rejectedData.map((item) => (
      <tr key={item._id}>
        {Object.keys(item)
          .filter((key) => key !== "_id") // Exclude '_id'
          .map((key) => (
            <td key={key}>
              {key === "acceptedData"
                ? renderAcceptedDataCell(item[key])
                : renderCellContent(item[key])}
            </td>
          ))}
      </tr>
    ));
  };

  const renderCellContent = (value) => {
    if (isURL(value)) {
      return (
        <img
          src={value}
          alt="Image"
          style={{ maxWidth: "100px", maxHeight: "100px", cursor: "pointer" }}
          onClick={() => setModalImage(value)}
        />
      );
    } else {
      return value;
    }
  };

  const renderAcceptedDataCell = (value) => {
    return value ? "Accepted" : "Rejected";
  };

  const isURL = (value) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  const exportToExcel = () => {
    const fileName = "rejectedData.csv";
    const rejectedData = formData.filter((item) => !item.acceptedData); // Only rejected data
    const csv = convertToCSV(rejectedData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, fileName);
    } else {
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  const convertToCSV = (data) => {
    const keys = Object.keys(data[0]);
    const header = keys
      .filter((key) => key !== "_id") // Exclude '_id'
      .map((key) => key.charAt(0).toUpperCase() + key.slice(1))
      .join(",");
    const rows = data.map((row) => {
      return keys
        .filter((key) => key !== "_id") // Exclude '_id'
        .map((key) => {
          let cell =
            row[key] === null || row[key] === undefined ? "" : row[key];
          cell = cell.toString().replace(/"/g, '""');
          if (cell.search(/("|,|\n)/g) >= 0) {
            cell = `"${cell}"`;
          }
          return cell;
        })
        .join(",");
    });
    return `${header}\n${rows.join("\n")}`;
  };

  return (
    <div className="form-view-data">
      <div className="form-view-title-container">
        <PageTitle title="View Rejected Data" />
      </div>
      <div className="form-view-data-container">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <React.Fragment>
            <div className="table-container">
              <table>
                <thead>
                  <tr>{renderTableHeaders()}</tr>
                </thead>
                <tbody>{renderTableRows()}</tbody>
              </table>
            </div>
            <div className="buttons">
              <button onClick={exportToExcel} className="refresh-button">
                Export to Excel
              </button>
              <button onClick={fetchData} className="refresh-button">
                Refresh
              </button>
            </div>
          </React.Fragment>
        )}
      </div>
      {modalImage && (
        <div className="modal" onClick={() => setModalImage(null)}>
          <span className="close" onClick={() => setModalImage(null)}>
            &times;
          </span>
          <img className="modal-content" src={modalImage} alt="Zoomed" />
        </div>
      )}
    </div>
  );
};

export default AdminRejectedData;
