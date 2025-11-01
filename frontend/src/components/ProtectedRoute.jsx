import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { token, user, loading } = useAuth();
  const location = useLocation();

  console.log(`%cProtectedRoute Check:`, "color: blue; font-weight: bold;", {
    pathname: location.pathname,
    tokenExists: !!token,
    userRole: user?.role,
    allowedRoles: allowedRoles || "Any logged-in user",
    isLoading: loading,
  });

  if (loading) {
    console.log("ProtectedRoute: Auth state is loading...");
    return <div>Loading...</div>;
  }

  if (!token) {
    console.log("ProtectedRoute: No token found. Redirecting to /sign-in.");
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    console.warn(
      `ProtectedRoute: Role mismatch! User role "${
        user.role
      }" is not in allowed roles [${allowedRoles.join(", ")}]. Redirecting.`
    );
    const correctDashboardPath =
      user.role === "PATIENT"
        ? "/patient-dashboard"
        : user.role === "HOSPITAL"
        ? "/hospital-dashboard"
        : "/sign-in";
    if (location.pathname !== correctDashboardPath) {
      console.log(`ProtectedRoute: Redirecting to ${correctDashboardPath}`);
      return <Navigate to={correctDashboardPath} replace />;
    } else {
      console.log(
        "ProtectedRoute: Role mismatch but already on redirect path. Allowing render to avoid loop."
      );
    }
  }

  console.log(
    `%cProtectedRoute: Access GRANTED for ${location.pathname}`,
    "color: green; font-weight: bold;"
  );
  return children;
};

export default ProtectedRoute;
