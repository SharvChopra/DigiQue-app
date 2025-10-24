import React from "react";
import { NavLink } from "react-router-dom";
import "./Layout.css";

const HospitalSidebar = () => {
  return (
    <aside className="dashboard-sidebar">
      <nav>
        <ul className="sidebar-nav">
          <li>
            <NavLink to="/hospital-dashboard"> 📊 Overview</NavLink>
          </li>
          <li>
            <NavLink to="/hospital-appointments">📅 Appointments</NavLink>
          </li>
          <li>
            <NavLink to="/hospital-doctors">👨‍⚕️ Doctors</NavLink>
          </li>
          <li>
            <NavLink to="/hospital-profile">🏥 Hospital Profile</NavLink>
          </li>
          <li>
            <NavLink to="/hospital-feedback">💬 Feedback</NavLink>
          </li>
          <li>
            <NavLink to="/hospital-settings"> ⚙️ Settings</NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default HospitalSidebar;
