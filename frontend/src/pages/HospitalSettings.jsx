import React from "react";
import AdminProfile from "../components/AdminProfile";
import ChangePassword from "../components/ChangePassword";
import "./PatientSettings.css";

const HospitalSettings = () => {
  return (
    <div className="settings-page">
      <h2 className="page-title=h1">Account Settings</h2>
      <p className="page-subtitle-h2">
        Manage your personal profile and security settings.
      </p>

      <AdminProfile />

      <ChangePassword />
    </div>
  );
};

export default HospitalSettings;
