import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);
const apiURL = import.meta.env.VITE_BACKEND_API_URL;

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUser = useCallback(
    async (currentToken) => {
      console.log(
        "AuthContext: Attempting fetchUser with token:",
        currentToken ? "Exists" : "None"
      ); // Log 1
      if (currentToken) {
        try {
          const response = await fetch(`${apiURL}/users/me`, {
            headers: { Authorization: `Bearer ${currentToken}` },
          });
          console.log(
            "AuthContext: /api/users/me response status:",
            response.status
          ); // Log 2
          if (response.ok) {
            const data = await response.json();
            console.log("AuthContext: User data received:", data); // Log 3
            setUser(data);
          } else {
            console.log("AuthContext: Token invalid or expired, logging out."); // Log 4
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
      console.log("AuthContext: Loading set to false"); // Log 7
    },
    [navigate]
  ); // Removed apiURL, logout from dependencies as they don't change or cause loops

  useEffect(() => {
    fetchUser(token);
  }, [token, fetchUser]);

  const login = (newToken) => {
    console.log("AuthContext: login function called."); // Log 8
    localStorage.setItem("token", newToken);
    setToken(newToken); // This triggers the useEffect above
  };

  const logout = () => {
    console.log("AuthContext: logout function called."); // Log 9
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    navigate("/sign-in");
  };

  const refetchUser = useCallback(async () => {
    console.log("AuthContext: refetchUser called."); // Log 10
    await fetchUser(token);
  }, [token, fetchUser]);

  console.log("AuthContext State: user=", user, "loading=", loading); // Log 11

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
