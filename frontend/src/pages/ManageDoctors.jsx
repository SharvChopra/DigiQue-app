import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
// Import modals later when created:
import AddEditDoctorModal from "../components/AddEditDoctorModal";
// import ScheduleEditorModal from '../components/ScheduleEditorModal';
import "./HospitalAdmin.css"; // Use shared admin styles
import ScheduleEditorModal from "../components/ScheduleEditorModal";

export default function ManageDoctors() {
  const { token } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for modals
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const apiURL = import.meta.env.VITE_BACKEND_API_URL;

  const fetchDoctors = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`${apiURL}/hospital/my-doctors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to fetch doctors");
      }
      const data = await response.json();
      setDoctors(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching doctors:", err);
    } finally {
      setLoading(false);
    }
  }, [token, apiURL]);

  useEffect(() => {
    setLoading(true);
    fetchDoctors();
  }, [fetchDoctors]);

  const handleOpenAddModal = () => {
    setSelectedDoctor(null); // Clear selected doctor for "Add" mode
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditModal = (doctor) => {
    setSelectedDoctor(doctor); // Set the doctor to be edited
    setIsAddEditModalOpen(true);
  };

  const handleOpenScheduleModal = (doctor) => {
    setSelectedDoctor(doctor); // Set the doctor whose schedule to edit
    setIsScheduleModalOpen(true); // Uncomment when Schedule Modal is ready
    // toast.info(`Schedule editing for Dr. ${doctor.name} coming soon!`); // Placeholder action
  };

  const handleCloseModals = () => {
    setIsAddEditModalOpen(false);
    setIsScheduleModalOpen(false);
    setSelectedDoctor(null); // Clear selection when any modal closes
  };

  // --- Delete Handler ---
  const handleDeleteDoctor = async (doctorId, doctorName) => {
    // Confirmation dialog
    if (
      !window.confirm(
        `Are you sure you want to remove Dr. ${doctorName}? This action cannot be undone.`
      )
    ) {
      return; // Stop if user cancels
    }

    try {
      const response = await fetch(`${apiURL}/hospital/doctors/${doctorId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to delete doctor");
      }
      toast.success(`Dr. ${doctorName} removed successfully.`);
      setDoctors((prevDoctors) =>
        prevDoctors.filter((doc) => doc._id !== doctorId)
      );
    } catch (err) {
      toast.error(err.message);
    }
  };

  // --- JSX ---
  return (
    <div className="manage-doctors-page">
      {/* Page Header */}
      <h2 className="page-title">Manage Doctors</h2>
      <p className="page-subtitle">
        Add, edit, or remove doctors and manage their schedules.
      </p>
      {/* Add Doctor Button */}
      <div className="add-doctor-section">
        <button className="add-doctor-btn" onClick={handleOpenAddModal}>
          + Add New Doctor
        </button>
      </div>
      {/* Loading State */}
      {loading && <p>Loading doctors...</p>}
      {/* Error State */}
      {error && !loading && (
        <div
          className="profile-card"
          style={{ borderColor: "#dc3545", color: "#dc3545" }}
        >
          <p>
            <strong>Error loading doctors:</strong> {error}
          </p>
        </div>
      )}
      {/* Doctors List or Empty State */}
      {!loading && !error && (
        <div className="doctors-list-container">
          {doctors.length === 0 ? (
            <div className="profile-card">
              {" "}
              {/* Reuse card style for empty message */}
              <p>
                No doctors added yet. Click "+ Add New Doctor" to get started.
              </p>
            </div>
          ) : (
            // Map over the fetched doctors array
            doctors.map((doc) => (
              <div key={doc._id} className="doctor-list-item">
                {/* Doctor Avatar */}
                <div className="doctor-list-avatar">
                  <img
                    src={
                      doc.profileImage ||
                      `https://placehold.co/55x55/e6f7f6/00a79d?text=${doc.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)
                        .toUpperCase()}`
                    }
                    alt={doc.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://placehold.co/55x55/e6f7f6/00a79d?text=${doc.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)
                        .toUpperCase()}`;
                    }}
                  />
                </div>
                <div className="doctor-list-details">
                  <h5>{doc.name}</h5>
                  <p>{doc.specialty}</p>
                </div>
                <div className="doctor-list-actions">
                  <button
                    className="schedule-btn"
                    onClick={() => handleOpenScheduleModal(doc)}
                  >
                    Edit Schedule
                  </button>
                  <button
                    className="edit-btn"
                    onClick={() => handleOpenEditModal(doc)}
                  >
                    Edit Info
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteDoctor(doc._id, doc.name)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      <AddEditDoctorModal
        isOpen={isAddEditModalOpen}
        onClose={handleCloseModals}
        onSaveSuccess={() => {
          fetchDoctors();
          handleCloseModals();
        }}
        doctor={selectedDoctor}
      />
      <ScheduleEditorModal
        isOpen={isScheduleModalOpen}
        onClose={handleCloseModals}
        onSaveSuccess={handleCloseModals}
        doctor={selectedDoctor}
      />
    </div>
  );
}
