import React from "react";
import { useAuth } from "../../context/AuthContext";
import "./layout.css";

export default function Header() {
  const { user, logout } = useAuth();
  return (
    <header className="dashboard-header">
      <div className="header-left">
        <span className="logo">DigiQue</span>
        <span className="welcome-msg">
          Welcome, {user?.firstName || "Guest"}
        </span>
      </div>
      <div className="header-right">
        <div className="user-profile">
          <div className="user-avatar">
            {user?.firstName?.charAt(0).toUpperCase()}
          </div>
          <button onClick={logout} className="logout-button">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
