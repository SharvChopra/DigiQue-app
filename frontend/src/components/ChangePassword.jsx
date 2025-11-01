import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const { token } = useAuth();

  const [isFormVisible, setIsFormVisible] = useState(false);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { currentPassword, newPassword, confirmPassword } = formData;
  const apiURL = import.meta.env.VITE_BACKEND_API_URL;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const clearForm = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    setIsLoading(true);

    try {
      const response = await fetch(`${apiURL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.msg || "Failed to change password");
      }

      toast.success("Password updated successfully!");
      clearForm();
      setIsFormVisible(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    clearForm();
    setIsFormVisible(false);
  };

  return (
    <div className="settings-card">
      <h4>Change Password</h4>

      {!isFormVisible ? (
        <div
          className="form-actions"
          style={{ justifyContent: "flex-start", marginTop: "10px" }}
        >
          <button
            type="button"
            className="save-btn" 
            onClick={() => setIsFormVisible(true)}
          >
            Change Password
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="settings-form-grid">
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={currentPassword}
                onChange={onChange}
                required
                disabled={isLoading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={onChange}
                minLength="6"
                required
                disabled={isLoading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={onChange}
                minLength="6"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button type="submit" className="save-btn" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ChangePassword;
