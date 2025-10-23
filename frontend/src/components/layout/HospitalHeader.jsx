import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import "./Layout.css";

const HospitalHeader = () => {
  const { user, logout, token } = useAuth();
  const [hospitalName, setHospitalName] = useState("Hospital Dashboard");
  const apiURL = import.meta.env.VITE_BACKEND_API_URL;

  useEffect(() => {
    const fetchHospitalName = async () => {
      if (user?.managedHospital && token) {
        try {
          const response = await fetch(
            `${apiURL}/hospitals/${user.managedHospital}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (response.ok) {
            const data = await response.json();
            setHospitalName(data.name || "Hospital Dashboard");
          }
        } catch (error) {
          console.error("Failed to fetch Hospital Name for headers:", error);
        }
      } else if (user?.firstName) {
        setHospitalName(`${user.firstName}'s Dashboard`);
      }
    };
    fetchHospitalName();
  }, [user, token, apiURL]);

  const avatarInitial = user?.firstName
    ? user.firstName.charAt(0).toUpperCase()
    : "A";
  return (
    <header className="dashboard-header">
      <div className="header-left">
        <span className="logo">DigiQue</span>
        <span className="welcome-msg">{hospitalName}</span>
      </div>
      <div className="header-right">
        <div className="user-profile">
          <div className="user-avatar">{avatarInitial}</div>
          {user && (
            <button onClick={logout} className="logout-button">
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default HospitalHeader;
