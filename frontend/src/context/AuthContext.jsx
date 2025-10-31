import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom"; // remove useLocation

const AuthContext = createContext(null);
const apiURL = import.meta.env.VITE_BACKEND_API_URL;

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Define logout first, wrapped in useCallback
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    navigate("/sign-in");
  }, [navigate]);

  // Define fetchUser, which can safely depend on logout
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
            logout(); // Token is invalid or expired
          }
        } catch (error) {
          console.error("AuthContext: Failed to fetch user:", error);
          logout(); // Logout on error
        }
      }
      setLoading(false);
    },
    [logout] // Depends on the stable logout function
  );

  // This effect runs on initial load to check for an existing session
  useEffect(() => {
    fetchUser(token);
  }, [token, fetchUser]);

  // Login just sets the token. The fetchUser effect will handle the rest.
  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
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
