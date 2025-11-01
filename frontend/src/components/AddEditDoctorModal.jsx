import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "./BookingModal.css";
import "../pages/HospitalAdmin.css";

const AddEditDoctorModal = ({ isOpen, onClose, onSaveSuccess, doctor }) => {
  const { token } = useAuth();
  const [name, setName] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const apiURL = import.meta.env.VITE_BACKEND_API_URL;

  const isEditMode = !!doctor;

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && doctor) {
        setName(doctor.name || "");
        setSpeciality(doctor.speciality || "");
        setProfileImage(doctor.profileImage || ""); // Reset file input
      } else {
        setName("");
        setSpeciality("");
        setProfileImage("");
      }
    }
  }, [doctor, isEditMode, isOpen]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const doctorData = { name, speciality, profileImage };
    const url = isEditMode
      ? `${apiURL}/hospital/doctors/${doctor._id}`
      : `${apiURL}/hospital/my-doctors`;
    const method = isEditMode ? "PUT" : "POST";
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(doctorData),
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(
          responseData.msg ||
            `Failed to ${isEditMode ? "update" : "add"} doctor`
        );
      }
      toast.success(`Doctor ${isEditMode ? "updated" : "added"} successfully!`);
      onSaveSuccess();
    } catch (err) {
      console.error(`Error ${isEditMode ? "updating" : "adding"} doctor:`, err);
      toast.error(
        err.message || `Error ${isEditMode ? "updating" : "adding"} doctor`
      );
    } finally {
      setIsSaving(false);
    }
  };
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content doctor-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close-button"
          onClick={onClose}
          disabled={isSaving}
        >
          &times;
        </button>
        <h3 className="heading">
          {isEditMode ? "Edit Doctor Information" : "Add New Doctor"}
        </h3>

        <form onSubmit={handleSave} className="form-grid">
          <div className="form-group form-main">
            <label htmlFor="docName">Doctor Name</label>
            <input
              id="docName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isSaving}
            />
          </div>
          <div className="form-group form-main">
            <label htmlFor="docSpecialty">Specialty</label>
            <input
              id="docSpecialty"
              type="text"
              value={speciality}
              onChange={(e) => setSpeciality(e.target.value)}
              placeholder="e.g., Cardiologist"
              required
              disabled={isSaving}
            />
          </div>
          <div className="form-group form-main">
            <label htmlFor="docImage">Profile Image URL (Optional)</label>
            <input
              id="docImage"
              type="text" // Using text input for URL
              value={profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
              placeholder="https://..."
              disabled={isSaving}
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button type="submit" className="confirm-btn" disabled={isSaving}>
              {isSaving
                ? "Saving..."
                : isEditMode
                ? "Save Changes"
                : "Add Doctor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditDoctorModal;
