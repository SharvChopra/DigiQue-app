import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

// Create the context
const AuthContext = createContext(null);
const apiURL = import.meta.env.VITE_BACKEND_API_URL;

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Get the navigate function from React Router

  // Function to fetch user data using a token
  const fetchUser = useCallback(async (currentToken) => {
    if (currentToken) {
      try {
        const response = await fetch(`${apiURL}/users/me`, {
          headers: { Authorization: `Bearer ${currentToken}` },
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          // If token is invalid, log the user out
          logout();
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  // This effect runs on initial page load to check for an existing session
  useEffect(() => {
    fetchUser(token);
  }, [token, fetchUser]);

  // --- THIS IS THE CORE OF THE FIX ---
  // This effect runs whenever the 'user' state changes.
  useEffect(() => {
    // If the user object is successfully populated (meaning they are logged in)
    if (user) {
      // Redirect based on their role
      if (user.role === "PATIENT") {
        navigate("/patient-dashboard");
      } else if (user.role === "HOSPITAL") {
        navigate("/hospital-dashboard"); // For future use
      }
    }
  }, [user, navigate]); // It depends on the user object and navigate function

  // Function to handle user login
  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken); // This will trigger the useEffect above to fetch the user
  };

  // Function to handle user logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    navigate("/sign-in"); // Redirect to the sign-in page on logout
  };

  const refetchUser = useCallback(async () => {
    await fetchUser(token);
  }, [token, fetchUser]);

  return (
    <AuthContext.Provider
      value={{ token, user, loading, login, logout, refetchUser }}
    >
      {/* Don't render children until the initial loading is complete */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily consume the context
export const useAuth = () => {
  return useContext(AuthContext);
};
