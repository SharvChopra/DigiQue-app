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
      const response = await fetch(`${apiURL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to login");
      }

      login(data.token); // Update the context

      toast.success("Signed in successfully!");
      navigate("/patient-dashboard");
      // --- END ADDITION ---
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
