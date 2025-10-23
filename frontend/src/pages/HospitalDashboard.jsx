import React from "react";
import { useAuth } from "../context/AuthContext";

export default function HospitalDashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h2>Hospital Dashboard</h2>
      <p>Welcome, {user?.firstName}!</p>
      <p>
        This is where you will manage your hospital Profile, doctors, and
        appointments.
      </p>
    </div>
  );
}
