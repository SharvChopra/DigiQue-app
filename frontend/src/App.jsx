import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext"; // Import useAuth

import DashboardLayout from "./components/layout/DashboardLayout";
import HospitalDashboardLayout from "./components/layout/HospitalDashboardLayout"; // Import Hospital Layout

import AuthPage from "./pages/AuthPage";
import PatientDashboard from "./pages/PatientDashboard";
import HospitalDetail from "./pages/HospitalDetail";
import MyAppointments from "./pages/MyAppointments";
import HelpFeedback from "./pages/HelpFeedback";
import PatientSettings from "./pages/PatientSettings";
import HospitalDashboard from "./pages/HospitalDashboard"; // Placeholder from before
// Add imports for new hospital pages: HospitalFeedback, HospitalAdminSettings

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HospitalProfile from "./pages/HospitalProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import ManageDoctors from "./pages/ManageDoctors";
import HospitalAppointment from "./pages/HospitalAppointment";

function App() {
  return (
    <>
      <Routes>
        <Route path="/sign-in" element={<AuthPage />} />
        <Route path="/" element={<AuthPage />} />

        <Route
          path="/patient-dashboard"
          element={
            <ProtectedRoute allowedRoles={["PATIENT"]}>
              <DashboardLayout>
                <PatientDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/hospitals/:id"
          element={
            <ProtectedRoute allowedRoles={["PATIENT"]}>
              <DashboardLayout>
                <HospitalDetail />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-appointments"
          element={
            <ProtectedRoute allowedRoles={["PATIENT"]}>
              <DashboardLayout>
                <MyAppointments />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/help-feedback"
          element={
            <ProtectedRoute allowedRoles={["PATIENT"]}>
              <DashboardLayout>
                <HelpFeedback />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRoles={["PATIENT"]}>
              <DashboardLayout>
                <PatientSettings />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/hospital-dashboard"
          element={
            <ProtectedRoute allowedRoles={["HOSPITAL"]}>
              {" "}
              <HospitalDashboardLayout>
                {" "}
                {/* Use Hospital Layout */}
                <HospitalDashboard /> {/* Overview Page */}
              </HospitalDashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/hospital-appointments"
          element={
            <ProtectedRoute allowedRoles={["HOSPITAL"]}>
              <HospitalDashboardLayout>
                <HospitalAppointment />
              </HospitalDashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/hospital-profile"
          element={
            <ProtectedRoute allowedRoles={["HOSPITAL"]}>
              <HospitalDashboardLayout>
                <HospitalProfile />
              </HospitalDashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/hospital-doctors"
          element={
            <ProtectedRoute allowedRoles={["HOSPITAL"]}>
              <HospitalDashboardLayout>
                <ManageDoctors />
              </HospitalDashboardLayout>
            </ProtectedRoute>
          }
        />
        {/* <Route
           path="/hospital-settings" // Admin's user settings
           element={
             <ProtectedRoute allowedRoles={['HOSPITAL']}>
               <HospitalDashboardLayout>
                 <PatientSettings /> // Can potentially reuse PatientSettings page? Or create HospitalAdminSettings
               </HospitalDashboardLayout>
             </ProtectedRoute>
           }
         /> */}
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
