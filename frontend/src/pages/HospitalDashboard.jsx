import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./HospitalDashboard.css"; // Import the CSS

// Helper to format date simply
const formatDateShort = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

export default function HospitalDashboard() {
  const { token } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const apiURL = import.meta.env.VITE_BACKEND_API_URL;

  useEffect(() => {
    const fetchSummary = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const response = await fetch(`${apiURL}/hospital/overview-summary`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard summary");
        }
        const data = await response.json();
        setSummary(data);
      } catch (err) {
        setError(err.message);
        toast.error("Could not load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [token, apiURL]);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!summary) return <div>Could not load summary data.</div>; // Should not happen if loading finishes

  // Determine if it's the first time login state (profile incomplete OR no doctors)
  const isFirstTimeSetup =
    !summary.profileStatus.isComplete || summary.profileStatus.needsDoctors;

  return (
    <div className="hospital-dashboard-overview">
      {/* --- Onboarding Prompt for New Users --- */}
      {isFirstTimeSetup && (
        <div className="onboarding-prompt">
          <h4>Get Started with DigiQue!</h4>
          {!summary.profileStatus.isComplete && (
            <p>
              Your hospital profile is incomplete. Please add details like your
              'About' section and the services you offer.
            </p>
          )}
          {summary.profileStatus.needsDoctors && (
            <p>
              You haven't added any doctors yet. Add doctors and set their
              schedules so patients can book appointments.
            </p>
          )}
          <div className="quick-actions-buttons">
            {!summary.profileStatus.isComplete && (
              <button onClick={() => navigate("/hospital-profile")}>
                Edit Hospital Profile
              </button>
            )}
            {summary.profileStatus.needsDoctors && (
              <button
                onClick={() => navigate("/hospital-doctors")}
                className="secondary-btn"
              >
                Manage Doctors
              </button>
            )}
          </div>
        </div>
      )}

      {/* --- Quick Stats --- */}
      <div className="overview-grid">
        <div className="stat-card">
          <h4>Today's Appointments</h4>
          <div className="value">{summary.stats.today}</div>
        </div>
        <div className="stat-card">
          <h4>Upcoming (Next 7 Days)</h4>
          <div className="value">{summary.stats.week}</div>
        </div>
        <div className="stat-card">
          <h4>Total Doctors Listed</h4>
          <div className="value">{summary.stats.doctors}</div>
        </div>
        {/* Add more stats if needed */}
      </div>

      <div className="upcoming-appointments">
        <h4>Upcoming Appointments</h4>
        {summary.upcoming.length > 0 ? (
          summary.upcoming.map((appt) => (
            <div key={appt._id} className="appointment-item">
              <span className="time">
                {formatDateShort(appt.date)} - {appt.time}
              </span>
              <span className="details">
                {appt.patient?.firstName} {appt.patient?.lastName} with{" "}
                {appt.doctor?.name}
              </span>
            </div>
          ))
        ) : (
          <p>No upcoming appointments scheduled.</p>
        )}
        <Link
          to="/hospital-appointments"
          style={{ display: "block", marginTop: "15px", fontSize: "14px" }}
        >
          View All
        </Link>
      </div>

      {!isFirstTimeSetup && ( // Hide quick actions if onboarding prompt is shown
        <div className="quick-actions">
          <h4>Quick Actions</h4>
          <div className="quick-actions-buttons">
            <button onClick={() => navigate("/hospital-doctors")}>
              Manage Doctors & Schedules
            </button>
            <button
              onClick={() => navigate("/hospital-profile")}
              className="secondary-btn"
            >
              Edit Hospital Profile
            </button>
            {/* Add more buttons as needed */}
          </div>
        </div>
      )}
    </div>
  );
}
