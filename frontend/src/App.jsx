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
// Add imports for new hospital pages: HospitalAppointments, ManageDoctors, HospitalProfile, HospitalFeedback, HospitalAdminSettings

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { token, user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or spinner
  }

  if (!token) {
    return <Navigate to="/sign-in" replace />;
  }

  // Role check if allowedRoles are specified
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect to a suitable default page or unauthorized page
    return (
      <Navigate
        to={user?.role === "PATIENT" ? "/patient-dashboard" : "/sign-in"}
        replace
      />
    );
  }

  return children;
};

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
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
              {/* Role Check */}
              <HospitalDashboardLayout>
                {" "}
                {/* Use Hospital Layout */}
                <HospitalDashboard /> {/* Overview Page */}
              </HospitalDashboardLayout>
            </ProtectedRoute>
          }
        />
        {/* Add other hospital routes similarly */}
        {/* Example:
         <Route
           path="/hospital-doctors"
           element={
             <ProtectedRoute allowedRoles={['HOSPITAL']}>
               <HospitalDashboardLayout>
                 <ManageDoctors />
               </HospitalDashboardLayout>
             </ProtectedRoute>
           }
         />
          <Route
           path="/hospital-settings" // Admin's user settings
           element={
             <ProtectedRoute allowedRoles={['HOSPITAL']}>
               <HospitalDashboardLayout>
                 <PatientSettings /> // Can potentially reuse PatientSettings page? Or create HospitalAdminSettings
               </HospitalDashboardLayout>
             </ProtectedRoute>
           }
         />
         */}
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
