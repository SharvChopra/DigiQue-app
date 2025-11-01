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

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    navigate("/sign-in");
  }, [navigate]);

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
            logout();
          }
        } catch (error) {
          console.error("AuthContext: Failed to fetch user:", error);
          logout(); // Logout on error
        }
      }
      setLoading(false);
    },
    [logout] 
  );

  useEffect(() => {
    fetchUser(token);
  }, [token, fetchUser]);

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
