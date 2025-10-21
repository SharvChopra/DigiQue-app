import { useState } from "react";
import { toast } from "react-toastify";
// import "./SignUpForm.css";

export default function SignUpForm({ className }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    location: "",
    role: "patient",
  });

  const apiURL = import.meta.env.VITE_BACKEND_API_URL;

  // This single function handles all text input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // This handles the dropdown change
  const handleRoleChange = (e) => {
    setFormData({ ...formData, role: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiURL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to register");
      }

      toast.success("Account created! Please sign in.");
      // Optional: Clear the form after successful submission
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phoneNumber: "",
        location: "",
        role: "patient",
      });
    } catch (err) {
      toast.error(err.message || "Sign up failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <h3>Create an Account</h3>

      {/* Each input now uses the formData object and the handleChange function */}
      <div className="input-group">
        <input
          id="firstName" // The 'id' must match the key in the formData state
          type="text"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <label htmlFor="firstName">First Name</label>
      </div>

      <div className="input-group">
        <input
          id="lastName"
          type="text"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <label htmlFor="lastName">Last Name</label>
      </div>

      <div className="input-group">
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
          required
        />
        <label htmlFor="email">Email Address</label>
      </div>

      <div className="input-group">
        <input
          id="phoneNumber"
          type="tel"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />
        <label htmlFor="phoneNumber">Phone Number</label>
      </div>

      <div className="input-group">
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="new-password"
          required
        />
        <label htmlFor="password">Password</label>
      </div>

      <div className="input-group">
        <input
          id="location"
          type="text"
          value={formData.location}
          onChange={handleChange}
          required
        />
        <label htmlFor="location">Your Location</label>
      </div>

      <select value={formData.role} onChange={handleRoleChange} required>
        <option value="patient">I am a Patient</option>
        <option value="hospital">We are a Hospital</option>
      </select>

      <button type="submit">Create Account</button>
    </form>
  );
}
