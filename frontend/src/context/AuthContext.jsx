import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AuthContext = createContext(null);
const apiURL = import.meta.env.VITE_BACKEND_API_URL;

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUser = useCallback(
    async (currentToken) => {
      if (currentToken) {
        try {
          const response = await fetch(`${apiURL}/users/me`, {
            headers: { Authorization: `Bearer ${currentToken}` },
          });
          if (response.ok) {
            const data = await response.json();
            setUser(data);
          } else {
            logout(); // Use the logout function which clears state and storage
          }
        } catch (error) {
          console.error("AuthContext: Failed to fetch user:", error); // Log 5
          logout(); // Logout on error
        }
      } else {
        console.log("AuthContext: No token found."); // Log 6
      }
      setLoading(false);
    },
    [navigate]
  );

  useEffect(() => {
    fetchUser(token);
  }, [token, fetchUser]);

  useEffect(() => {
    if (user) {
      const isOnPatientPage = location.pathname.startsWith("/patient-");
      const isOnHospitalPage = location.pathname.startsWith("/hospital-");
      const isAuthPage =
        location.pathname === "/sign-in" || location.pathname === "/";

      if (user.role === "PATIENT" && !isOnPatientPage) {
        navigate("/patient-dashboard");
      } else if (user.role === "HOSPITAL" && !isOnHospitalPage) {
        navigate("/hospital-dashboard");
      } else if (isAuthPage) {
        const dashboard =
          user.role === "HOSPITAL"
            ? "/hospital-dashboard"
            : "/patient-dashboard";
        navigate(dashboard);
      }
    }
  }, [user, navigate, location]);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    navigate("/sign-in");
  };

  const refetchUser = useCallback(async () => {
    await fetchUser(token);
  }, [token, fetchUser]);

  return (
    <AuthContext.Provider
      value={{ token, user, loading, login, logout, refetchUser }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  return useContext(AuthContext);
};
