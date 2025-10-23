import React from "react";
import HospitalHeader from "./HospitalHeader";
import HospitalSidebar from "./HospitalSidebar";
import "./Layout.css";

const HospitalDashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-layout">
      {" "}
      <HospitalHeader />
      <HospitalSidebar />
      <main className="dashboard-main-content">{children}</main>
    </div>
  );
};

export default HospitalDashboardLayout;
