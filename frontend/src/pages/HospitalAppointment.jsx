import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "./HospitalAdmin.css";
import "./AppointmentActions.css"; // The new CSS for buttons

// Helper to format Date to YYYY-MM-DD
const formatDateForInput = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().split("T")[0];
};
const formatDateReadable = (dateString) => {
  if (!dateString) return "N/A";
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export default function HospitalAppointments() {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [filterDate, setFilterDate] = useState(formatDateForInput(new Date())); // Default to today
  const [filterDoctor, setFilterDoctor] = useState("");
  const [filterStatus, setFilterStatus] = useState("Scheduled"); 

  const apiURL = import.meta.env.VITE_BACKEND_API_URL;

  // Fetch Doctors for filter dropdown
  const fetchDoctors = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetch(`${apiURL}/hospital/my-doctors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) setDoctors(await response.json());
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  }, [token, apiURL]);

  // Fetch Appointments based on filters
  const fetchAppointments = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    const queryParams = new URLSearchParams();
    if (filterDate) queryParams.append("date", filterDate);
    if (filterDoctor) queryParams.append("doctorId", filterDoctor);
    if (filterStatus) queryParams.append("status", filterStatus);

    try {
      const response = await fetch(
        `${apiURL}/hospital/my-appointments?${queryParams.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch appointments");
      setAppointments(await response.json());
    } catch (err) {
      setError(err.message);
      toast.error("Could not load appointments.");
    } finally {
      setLoading(false);
    }
  }, [token, apiURL, filterDate, filterDoctor, filterStatus]);

  // Initial data load
  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  useEffect(() => {
    fetchAppointments(); // Fetch appointments on load and when filters change
  }, [fetchAppointments]);

  // --- Your Handler Function for Updating Status ---
  const handleUpdateStatus = async (appointmentId, newStatus) => {
    if (
      !window.confirm(
        `Are you sure you want to ${
          newStatus === "Completed" ? "complete" : "cancel"
        } this appointment?`
      )
    ) {
      return;
    }
    try {
      const response = await fetch(
        `${apiURL}/hospital/appointments/${appointmentId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const updatedAppointment = await response.json();
      if (!response.ok) {
        throw new Error(updatedAppointment.msg || "Failed to update status");
      }

      // Update state locally for instant UI change
      setAppointments((prevAppointments) =>
        prevAppointments.map((app) =>
          app._id === appointmentId ? updatedAppointment : app
        )
      );
      toast.success(`Appointment marked as ${newStatus}.`);

      if (filterStatus === "Scheduled") {
        setAppointments((prevAppointments) =>
          prevAppointments.filter((app) => app._id !== appointmentId)
        );
      }
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error(err.message);
    }
  };

  // --- JSX ---
  return (
    <div className="hospital-appointments-page">
      <h2 className="page-title-h1">Appointments</h2>
      <p className="page-subtitle-h2">
        View and manage scheduled appointments for your hospital.
      </p>

      <div className="appointments-filter-section">
        <div className="filter-group">
          <label htmlFor="filter-date">Date</label>
          <input
            type="date"
            id="filter-date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label htmlFor="filter-doctor">Doctor</label>
          <select
            id="filter-doctor"
            value={filterDoctor}
            onChange={(e) => setFilterDoctor(e.target.value)}
          >
            <option value="">All Doctors</option>
            {doctors.map((doc) => (
              <option key={doc._id} value={doc._id}>
                {doc.name}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="filter-status">Status</label>
          <select
            id="filter-status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="">All</option>
          </select>
        </div>
      </div>

      {loading && <p>Loading appointments...</p>}
      {error && !loading && (
        <div className="profile-card" style={{ borderColor: "red" }}>
          <p style={{ color: "red" }}>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="appointments-table-container">
          {appointments.length === 0 ? (
            <div className="no-appointments-message">
              <p>No appointments found for the selected criteria.</p>
            </div>
          ) : (
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Patient Contact</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Actions</th> {/* <-- Actions Header */}
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr key={appt._id}>
                    <td>
                      {appt.patient
                        ? `${appt.patient.firstName} ${appt.patient.lastName}`
                        : "N/A"}
                    </td>
                    <td>
                      {appt.patient?.email ||
                        appt.patient?.phoneNumber ||
                        "N/A"}
                    </td>
                    <td>{appt.doctor?.name || "N/A"}</td>
                    <td>{formatDateReadable(appt.date)}</td>
                    <td>{appt.time}</td>
                    <td>
                      <span
                        className={`status-badge status-${
                          appt.status?.toLowerCase() || "scheduled"
                        }`}
                      >
                        {appt.status || "Scheduled"}
                      </span>
                    </td>
                    {/* --- Actions Cell --- */}
                    <td className="appointment-actions">
                      {appt.status === "Scheduled" ? (
                        <>
                          <button
                            className="action-btn complete"
                            onClick={() =>
                              handleUpdateStatus(appt._id, "Completed")
                            }
                          >
                            Complete
                          </button>
                          <button
                            className="action-btn cancel"
                            onClick={() =>
                              handleUpdateStatus(appt._id, "Cancelled")
                            }
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <span>{appt.status}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
