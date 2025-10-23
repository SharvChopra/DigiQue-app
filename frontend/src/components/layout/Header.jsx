import React from "react";
import { useAuth } from "../../context/AuthContext";
import "./Layout.css";

export default function Header() {
  const { user, logout } = useAuth();

  const displayName = user?.firstName || "Guest";
  const avatarInitial = user?.firstName
    ? user.firstName.charAt(0).toUpperCase()
    : "";

  console.log("Header rendering, user:", user);

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <span className="logo">DigiQue</span>
        <span className="welcome-msg">
          Welcome, {displayName} 
        </span>
      </div>
      <div className="header-right">
        <div className="user-profile">
          <div className="user-avatar">
            {avatarInitial}
          </div>
          {user && (
            <button onClick={logout} className="logout-button">
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
