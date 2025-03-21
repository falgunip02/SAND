import React, { useState } from "react";
import axios from "axios";
import "./AdminViewAttendance.css";
import PageTitle from "../../../../../components/PageTitles/PageTitle";

const AdminViewAttendance = () => {
  const [email, setEmail] = useState("");
  const [attendanceDetails, setAttendanceDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const rowsPerPage = 10;

  // Fetch attendance details
  const fetchAttendanceDetails = async () => {
    try {
      const response = await axios.post(
        "https://sand-backend-kwqd.onrender.com/api/v1/promoter/fetchPromoterAttendanceDetails",
        { email }
      );

      // console.log("Response: ", response.data);

      if (response.data && response.data.data) {
        setAttendanceDetails(response.data.data); // Assign the received data
        setErrorMessage("");
        setCurrentPage(1); // Reset to the first page
      } else {
        setAttendanceDetails(null);
        setErrorMessage("No attendance details found for this email.");
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message || "Failed to Fetch ");
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }

      setAttendanceDetails(null);
      // setErrorMessage("Email Entry doesn't exist");
    }
  };

  // Pagination: Handle next page
  const handleNextPage = () => {
    if (
      attendanceDetails &&
      currentPage * rowsPerPage < attendanceDetails.attendanceDetails.length
    ) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Pagination: Handle previous page
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Calculate duration and status (including Half Day condition)
  const calculateDuration = (punchInTime, punchOutTime) => {
    if (!punchInTime || !punchOutTime)
      return { duration: "N/A", status: "Absent" };

    const punchIn = new Date(punchInTime);
    const punchOut = new Date(punchOutTime);
    const duration = (punchOut - punchIn) / 1000 / 60; // Duration in minutes

    const hours = Math.floor(duration / 60);
    const minutes = Math.round(duration % 60);
    const durationString = `${hours}h ${minutes}m`;

    // Determine status based on duration
    let status = "Absent";
    if (duration >= 8 * 60) {
      status = "Present";
    } else if (duration >= 4 * 60 && duration < 8 * 60) {
      status = "Half Day";
    }

    return { duration: durationString, status };
  };

  // Handle full-screen image display
  const handleImageClick = (imageUrl) => {
    setFullScreenImage(imageUrl);
  };

  // Exit full-screen mode
  const handleExitFullScreen = () => {
    setFullScreenImage(null);
  };

  // Determine rows to display based on current page
  const displayedRows = attendanceDetails
    ? attendanceDetails.attendanceDetails.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
      )
    : [];

  return (
    <div className="admin-view-attendance">
      <PageTitle title="View Attendance" />
      <div className="admin-view-attendance-container">
        {/* Search Input */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Enter promoter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="search-input"
          />
          <button onClick={fetchAttendanceDetails} className="search-button">
            Search
          </button>
        </div>

        {attendanceDetails ? (
          <>
            {/* Attendance Table */}
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Promoter Email</th>
                  <th>Attendance Date</th>
                  <th>Punch In</th>
                  <th>Punch Out</th>
                  <th>Duration</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {displayedRows.map((attendance, index) => {
                  const { duration, status } = attendance.punchInTime
                    ? calculateDuration(
                        attendance.punchInTime,
                        attendance.punchOutTime
                      )
                    : {
                        duration: "N/A",
                        status: attendance.status || "Absent",
                      };

                  return (
                    <tr
                      key={index}
                      style={{
                        backgroundColor:
                          status === "Present"
                            ? "#64E3A1" // Green for Present
                            : status === "Half Day"
                            ? "#FFD966" // Yellow for Half Day
                            : "#F48B81", // Red for Absent
                      }}
                    >
                      <td>{attendanceDetails.promoterEmail}</td>
                      <td>{new Date(attendance.date).toLocaleDateString()}</td>
                      <td>
                        {attendance.punchInTime
                          ? new Date(
                              attendance.punchInTime
                            ).toLocaleTimeString()
                          : "N/A"}
                        <br />
                        {attendance.punchInImage && (
                          <img
                            src={attendance.punchInImage}
                            alt="Punch In"
                            className="attendance-image"
                            onClick={() =>
                              handleImageClick(attendance.punchInImage)
                            }
                          />
                        )}
                      </td>
                      <td>
                        {attendance.punchOutTime
                          ? new Date(
                              attendance.punchOutTime
                            ).toLocaleTimeString()
                          : "N/A"}
                        <br />
                        {attendance.punchOutImage && (
                          <img
                            src={attendance.punchOutImage}
                            alt="Punch Out"
                            className="attendance-image"
                            onClick={() =>
                              handleImageClick(attendance.punchOutImage)
                            }
                          />
                        )}
                      </td>
                      <td>{duration}</td>
                      <td>{status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="pagination-controls">
              <button
                onClick={handlePreviousPage}
                className="previous-button"
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                className="next-button"
                disabled={
                  currentPage * rowsPerPage >=
                  attendanceDetails.attendanceDetails.length
                }
              >
                Next
              </button>
            </div>

            {/* Full-screen Image View */}
            {fullScreenImage && (
              <div
                className="fullscreen-image-container"
                onClick={handleExitFullScreen}
              >
                <img
                  src={fullScreenImage}
                  alt="Full View"
                  className="fullscreen-image"
                />
                <span className="close-button">&times;</span>
              </div>
            )}
          </>
        ) : (
          <p className="info-message">
            {errorMessage ||
              "Please enter an email to view attendance details."}
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminViewAttendance;
