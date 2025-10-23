import React from "react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import "./PatientSettings.css";

const PatientSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const { user, token, refetchUser, loading } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    address: { street: "", city: "", state: "", zipCode: "" },
    emergencyContact: { name: "", phone: "" },
    profilePicture: "",
  });
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const apiURL = import.meta.env.VITE_BACKEND_API_URL;

  console.log("PatientSettings rendering, user:", user);

  useEffect(() => {
    console.log("PatientSettings useEffect running, user:", user);
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        dateOfBirth: user.dateOfBirth
          ? new Date(user.dateOfBirth).toISOString().split("T")[0]
          : "",
        gender: user.gender || "",
        address: {
          street: user.address?.street || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          zipCode: user.address?.zipCode || "",
        },
        emergencyContact: {
          name: user.emergencyContact?.name || "",
          phone: user.emergencyContact?.phone || "",
        },
        profilePicture: user.profilePicture || "",
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        dateOfBirth: "",
        gender: "",
        address: { street: "", city: "", state: "", zipCode: "" },
        emergencyContact: { name: "", phone: "" },
        profilePicture: "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === "history") {
      const fetchHistory = async () => {
        setLoadingHistory(true);
        try {
          const res = await fetch(`${apiURL}/users/me/history`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          setHistory(data);
        } catch (err) {
          toast.error("Failed to load Update History");
        }
        setLoadingHistory(false);
      };
      fetchHistory();
    }
  }, [activeTab, token, apiURL]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
  };

  const handleEmergencyContactChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      emergencyContact: { ...prev.emergencyContact, [name]: value },
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${apiURL}/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      await refetchUser();

      toast.success("Profile Updated Successfully");
      setIsEditing(false);
    } catch (err) {
      toast.error(err.message);
    }
  };
  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        dateOfBirth: user.dateOfBirth
          ? new Date(user.dateOfBirth).toISOString().split("T")[0]
          : "",
        gender: user.gender || "",
        address: {
          street: user.address?.street || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          zipCode: user.address?.zipCode || "",
        },
        emergencyContact: {
          name: user.emergencyContact?.name || "",
          phone: user.emergencyContact?.phone || "",
        },
        profilePicture: user.profilePicture || "",
      });
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }
  if (!user) {
    return <div>User not found. Please try logging in again.</div>;
  }
  return (
    <div className="settings-page">
      <h2 className="page-title">Patient Settings</h2>
      <p className="page-subtitle">
        Manage your personal information and view your update history
      </p>

      <div className="settings-tabs">
        <button
          onClick={() => setActiveTab("profile")}
          className={activeTab === "profile" ? "active" : ""}
        >
          Profile Information
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={activeTab === "history" ? "active" : ""}
        >
          Update History
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <form onSubmit={handleSave}>
          {/* Profile Header Card */}
          <div className="settings-card">
            <div className="profile-header">
              {/* <img
                src={
                  user.profilePicture ||
                  `https://placehold.co/70x70/E0E0E0/555?text=${user.firstName.charAt(
                    0
                  )}`
                }
                alt="Avatar"
                className="profile-avatar"
              /> */}
              <div className="profile-info">
                <h3>
                  {user.firstName} {user.lastName}
                </h3>
                <p>{user.email}</p>
                {!isEditing && (
                  <button
                    type="button"
                    className="edit-profile-btn"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Personal Information Card */}
          <div className="settings-card">
            <h4>Personal Information</h4>
            <div className="settings-form-grid">
              <div className="form-group">
                <label>First Name</label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <input
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          {/* Address Information Card */}
          <div className="settings-card">
            <h4>Address Information</h4>
            <div className="settings-form-grid">
              <div className="form-group">
                <label>Street Address</label>
                <input
                  name="street"
                  value={formData.address?.street}
                  onChange={handleAddressChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="form-group">
                <label>City</label>
                <input
                  name="city"
                  value={formData.address?.city}
                  onChange={handleAddressChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="form-group">
                <label>State</label>
                <input
                  name="state"
                  value={formData.address?.state}
                  onChange={handleAddressChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="form-group">
                <label>ZIP Code</label>
                <input
                  name="zipCode"
                  value={formData.address?.zipCode}
                  onChange={handleAddressChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact Card */}
          <div className="settings-card">
            <h4>Emergency Contact</h4>
            <div className="settings-form-grid">
              <div className="form-group">
                <label>Contact Name</label>
                <input
                  name="name"
                  value={formData.emergencyContact?.name}
                  onChange={handleEmergencyContactChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="form-group">
                <label>Contact Phone</label>
                <input
                  name="phone"
                  value={formData.emergencyContact?.phone}
                  onChange={handleEmergencyContactChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button type="submit" className="save-btn">
                Save Changes
              </button>
            </div>
          )}
        </form>
      )}

      {/* History Tab */}
      {activeTab === "history" && (
        <div className="settings-card">
          <h4>Recent Updates</h4>
          {/* ... History rendering logic ... */}
        </div>
      )}
    </div>
  );
};

export default PatientSettings;
