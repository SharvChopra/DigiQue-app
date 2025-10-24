import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Add useNavigate back
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

export default function SignInForm({ className }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Get navigate function
  const { login } = useAuth();

  const apiURL = import.meta.env.VITE_BACKEND_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // --- Login Request ---
      const loginResponse = await fetch(`${apiURL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(loginData.message || "Failed to login");
      }

      const receivedToken = loginData.token;
      login(receivedToken); // Update AuthContext with the new token

      // --- Fetch User Role AFTER Login ---
      // We need to determine where to redirect based on the role
      let userRole = null;
      try {
        const userResponse = await fetch(`${apiURL}/users/me`, {
          headers: { Authorization: `Bearer ${receivedToken}` },
        });
        if (userResponse.ok) {
          const userData = await userResponse.json();
          userRole = userData.role; // Get the role directly
        } else {
          throw new Error("Could not fetch user role after login.");
        }
      } catch (roleError) {
        toast.error("Login successful, but failed to determine user role.");
        return; // Stop execution
      }

      // --- Role-Based Navigation ---
      toast.success("Signed in successfully!");
      if (userRole === "PATIENT") {
        navigate("/patient-dashboard");
      } else if (userRole === "HOSPITAL") {
        navigate("/hospital-dashboard");
      } else {
        navigate("/"); // Or back to sign-in
      }
    } catch (err) {
      toast.error(err.message || "Sign in failed.");
    }
  };
  return (
    <form onSubmit={handleSubmit} className={className}>
      <h3>Welcome Back!</h3>
      <div className="input-group">
        <input
          id="email-signin" // Use a unique id
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <label htmlFor="email-signin">Email Address</label>
      </div>

      <div className="input-group">
        <input
          id="password-signin" // Use a unique id
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
        <label htmlFor="password-signin">Password</label>
      </div>
      <button type="submit">Sign In</button>
    </form>
  );
}
