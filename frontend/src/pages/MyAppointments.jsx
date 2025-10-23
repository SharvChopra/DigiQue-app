import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import RescheduleModal from "../components/RescheduleModal"; // Import the RescheduleModal
import "./MyAppointments.css";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false); // State for modal

  const { token } = useAuth();
  const apiURL = import.meta.env.VITE_BACKEND_API_URL;

  // --- Fetch Appointments ---
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!token) {
        setLoading(false); // Stop loading if no token
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${apiURL}/appointments/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch appointments");
        }
        const data = await response.json();
        setAppointments(data);
      } catch (err) {
        setError(err.message);
        toast.error("Could not load appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [token, apiURL]);

  // --- Helper Functions ---
  const isPastAppointment = (appointment) => {
    if (!appointment) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set today to the beginning of the day for comparison
    const apptDate = new Date(appointment.date);
    apptDate.setHours(0, 0, 0, 0); // Set appt date to the beginning of the day
    return apptDate < today;
  };

  const getAppointmentsForDate = (date) => {
    // Filter out cancelled appointments
    return appointments.filter((appt) => {
      if (appt.status === "Cancelled") return false;
      const apptDate = new Date(appt.date);
      return (
        apptDate.getFullYear() === date.getFullYear() &&
        apptDate.getMonth() === date.getMonth() &&
        apptDate.getDate() === date.getDate()
      );
    });
  };

  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  // --- Calendar Tile Rendering ---
  const renderTileContent = ({ date, view }) => {
    if (view === "month") {
      const appointmentsOnDate = getAppointmentsForDate(date);
      if (appointmentsOnDate.length > 0) {
        return (
          <div
            className="appointment-indicator"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedAppointment(appointmentsOnDate[0]);
            }}
            title={appointmentsOnDate[0].doctor.name} // Add tooltip for better UX
          >
            {appointmentsOnDate[0].doctor.name}
          </div>
        );
      }
    }
    return null;
  };

  // --- Modal and Action Handlers ---
  const handleOpenRescheduleModal = () => {
    if (selectedAppointment) {
      setIsRescheduleModalOpen(true);
    }
  };

  const handleCloseRescheduleModal = () => {
    setIsRescheduleModalOpen(false);
  };

  const handleAppointmentRescheduled = (updatedAppointment) => {
    // Update the main list
    setAppointments((prev) =>
      prev.map((appt) =>
        appt._id === updatedAppointment._id ? updatedAppointment : appt
      )
    );
    // Update the currently selected details
    setSelectedAppointment(updatedAppointment);
    toast.info("Calendar updated."); // Give feedback
  };

  const handleCancelAppointment = async () => {
    if (
      !selectedAppointment ||
      !window.confirm(
        "Are you sure you want to cancel this appointment? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${apiURL}/appointments/${selectedAppointment._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "Cancelled" }), // Set status to Cancelled
        }
      );

      if (!response.ok) throw new Error("Cancellation failed.");

      const cancelledAppointment = await response.json(); // Get updated appointment back (status: Cancelled)
      toast.success("Appointment cancelled successfully.");

      // Remove the appointment from the list in state so it disappears from calendar
      setAppointments((prev) =>
        prev.filter((appt) => appt._id !== cancelledAppointment._id)
      );
      setSelectedAppointment(null); // Clear the details sidebar
    } catch (err) {
      toast.error(err.message || "Failed to cancel appointment.");
    }
  };

  // --- JSX Rendering ---
  return (
    <div className="my-appointments-page">
      <h2 className="page-title">My Appointments</h2>
      <p className="page-subtitle">
        View and manage your upcoming appointments
      </p>

      {loading && <p>Loading appointments...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {!loading && !error && (
        <div className="appointments-container">
          <div className="calendar-container">
            <Calendar
              onChange={setCalendarDate}
              value={calendarDate}
              tileContent={renderTileContent}
              onClickDay={(value) => {
                const appointmentsOnDate = getAppointmentsForDate(value);
                setSelectedAppointment(
                  appointmentsOnDate.length > 0 ? appointmentsOnDate[0] : null
                );
              }}
            />
          </div>

          <aside className="details-sidebar">
            {selectedAppointment ? (
              <div className="appointment-details">
                <h4>Appointment Details</h4>

                <div className="appointment-doctor-info">
                  <div className="doctor-initials">
                    {selectedAppointment.doctor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase()}
                  </div>
                  <div className="doctor-name-spec">
                    <p>{selectedAppointment.doctor.name}</p>
                    <p>
                      <span>{selectedAppointment.doctor.specialty}</span>
                    </p>
                  </div>
                </div>
                <div className="appointment-info-row">
                  🏥{" "}
                  <span>
                    {selectedAppointment.hospital?.name || "Unknown Hospital"}
                  </span>
                </div>
                <div className="appointment-info-row">
                  📅 <span>{formatDate(selectedAppointment.date)}</span>
                </div>
                <div className="appointment-info-row">
                  🕒 <span>{formatTime(selectedAppointment.time)}</span>
                </div>

                {/* Conditionally Render Buttons */}
                {!isPastAppointment(selectedAppointment) ? (
                  <div className="details-actions">
                    <button
                      className="reschedule-btn"
                      onClick={handleOpenRescheduleModal}
                    >
                      Reschedule
                    </button>
                    <button
                      className="cancel-btn-details"
                      onClick={handleCancelAppointment}
                    >
                      Cancel Appointment
                    </button>
                  </div>
                ) : (
                  <p
                    style={{
                      marginTop: "20px",
                      color: "#888",
                      fontSize: "14px",
                      textAlign: "center",
                    }}
                  >
                    This appointment is in the past.
                  </p>
                )}
              </div>
            ) : (
              <div className="details-placeholder">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 0 24 24"
                  width="24px"
                  fill="#cccccc"
                >
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-.5-13h1v6l5.25 3.15-.75 1.23L11 13V7z" />
                </svg>
                <p>
                  Select an appointment
                  <br />
                  to view details
                </p>
              </div>
            )}
          </aside>
        </div>
      )}

      <RescheduleModal
        appointment={selectedAppointment}
        isOpen={isRescheduleModalOpen}
        onClose={handleCloseRescheduleModal}
        onRescheduled={handleAppointmentRescheduled}
      />
    </div>
  );
}
