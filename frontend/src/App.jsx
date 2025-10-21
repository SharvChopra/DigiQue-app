import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import PatientDashboard from "./pages/PatientDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HospitalDetail from "./pages/HospitalDetail";
import "./App.css";
import MyAppointments from "./pages/MyAppointments";
import HelpFeedback from "./pages/HelpFeedback";
import PatientSettings from "./pages/PatientSettings";

function App() {
  return (
    <>
      <Routes>
        <Route path="/sign-in" element={<AuthPage />} />
        <Route path="/sign-up" element={<AuthPage />} />
        <Route path="/" element={<AuthPage />} />
        <Route
          path="/patient-dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <PatientDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/hospitals/:id"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <HospitalDetail />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-appointments"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <MyAppointments />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/help-feedback"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <HelpFeedback />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <PatientSettings />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
export default App;
