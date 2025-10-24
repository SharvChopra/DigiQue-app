import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { token, user, loading } = useAuth();
  const location = useLocation();

  // --- DETAILED LOGGING ---
  console.log(`%cProtectedRoute Check:`, "color: blue; font-weight: bold;", {
    pathname: location.pathname,
    tokenExists: !!token,
    userRole: user?.role, // Log the actual role from context
    allowedRoles: allowedRoles || "Any logged-in user",
    isLoading: loading,
  });
  // --- END LOGGING ---

  if (loading) {
    console.log("ProtectedRoute: Auth state is loading...");
    return <div>Loading...</div>;
  }

  if (!token) {
    console.log("ProtectedRoute: No token found. Redirecting to /sign-in.");
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  // --- Role Check ---
  // 1. Check if allowedRoles were provided
  // 2. Check if the user object actually exists (it might briefly be null even if token exists)
  // 3. Check if the user's role is NOT included in the allowedRoles array
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    console.warn(
      `ProtectedRoute: Role mismatch! User role "${
        user.role
      }" is not in allowed roles [${allowedRoles.join(", ")}]. Redirecting.`
    );
    // Determine redirect path based on the ACTUAL user role
    const correctDashboardPath =
      user.role === "PATIENT"
        ? "/patient-dashboard"
        : user.role === "HOSPITAL"
        ? "/hospital-dashboard"
        : "/sign-in"; // Fallback to sign-in if role is unexpected
    // Avoid infinite redirect loops if already on the intended redirect path
    if (location.pathname !== correctDashboardPath) {
      console.log(`ProtectedRoute: Redirecting to ${correctDashboardPath}`);
      return <Navigate to={correctDashboardPath} replace />;
    } else {
      // This case should ideally not happen if routing is correct, but prevents loops
      console.log(
        "ProtectedRoute: Role mismatch but already on redirect path. Allowing render to avoid loop."
      );
    }
  }

  // If all checks pass...
  console.log(
    `%cProtectedRoute: Access GRANTED for ${location.pathname}`,
    "color: green; font-weight: bold;"
  );
  return children;
};

export default ProtectedRoute;
