import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "./Layout.css";

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">
      <Header />
      <Sidebar />
      <main className="dashboard-main-content">{children}</main>
    </div>
  );
}
