import React from "react";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "./HospitalAdmin.css"; // Assuming this is your CSS file

const HospitalProfile = () => {
  const { token, refetchUser } = useAuth(); // Import refetchUser to update context after save
  const [formData, setFormData] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    location: "",
    logoUrl: "",
    contactPhone: "",
    contactEmail: "",
    websiteUrl: "",
    about: "",
    services: [],
  });
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [serviceInput, setServiceInput] = useState("");
  const [isEditing, setIsEditing] = useState(false); // New state for edit mode
  const [selectedLogoFile, setSelectedLogoFile] = useState(null);

  const apiURL = import.meta.env.VITE_BACKEND_API_URL;

  const fetchProfile = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await fetch(`${apiURL}/hospital/my-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch hospital profile");
      const data = await response.json();

      const addressParts = (data.address || "").split(",");
      const street = addressParts[0]?.trim() || "";
      const cityStateZip = addressParts.slice(1).join(",").trim();
      const city = data.location || cityStateZip.split(" ")[0] || "";
      const state = ""; // Your current logic for state/zip is rudimentary, consider improving
      const zipCode = "";

      const initialFormData = {
        name: data.name || "",
        street: street,
        city: city,
        state: state,
        zipCode: zipCode,
        location: data.location || city,
        logoUrl: data.logoUrl || "",
        contactPhone: data.contactPhone || "",
        contactEmail: data.contactEmail || "",
        websiteUrl: data.websiteUrl || "",
        about: data.about || "",
        services: data.services || [],
      };
      setFormData(initialFormData);
      setOriginalData(initialFormData);
    } catch (err) {
      setError(err.message);
      toast.error("Could not load hospital profile.");
    } finally {
      setLoading(false);
    }
  }, [token, apiURL]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleServiceInputChange = (e) => {
    setServiceInput(e.target.value);
  };

  const handleAddService = (e) => {
    if (e.key === "Enter" && serviceInput.trim()) {
      e.preventDefault();
      const newService = serviceInput.trim();
      if (newService && !formData.services.includes(newService)) {
        setFormData((prev) => ({
          ...prev,
          services: [...prev.services, newService],
        }));
      }
      setServiceInput("");
    }
  };

  const handleRemoveService = (serviceToRemove) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((s) => s !== serviceToRemove),
    }));
  };

  const handleCancel = () => {
    if (originalData) {
      setFormData(originalData); // Reset form to initially loaded data
    }
    setIsEditing(false); // Exit edit mode
  };

  // In HospitalProfile.js
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let newLogoUrl = formData.logoUrl; // Start with the current URL

      if (selectedLogoFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("logo", selectedLogoFile); // 'logo' matches backend route

        const uploadResponse = await fetch(`${apiURL}/upload/hospital-logo`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload logo image");
        }

        const uploadResult = await uploadResponse.json();
        newLogoUrl = uploadResult.imageUrl; // Get the new URL from the backend
      }

      const fullAddress =
        `${formData.street}, ${formData.city}, ${formData.state} ${formData.zipCode}`
          .replace(/ ,|, $/g, "")
          .trim();

      const payload = {
        name: formData.name,
        address: fullAddress,
        location: formData.city || formData.location,
        logoUrl: newLogoUrl, // <-- Use the correct URL
        contactPhone: formData.contactPhone,
        contactEmail: formData.contactEmail,
        websiteUrl: formData.websiteUrl,
        about: formData.about,
        services: formData.services,
      };

      // 3. --- Save the Profile ---
      const response = await fetch(`${apiURL}/hospital/my-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to update profile");
      }

      // 4. --- Success ---
      const updatedData = await response.json();

      // Update originalData to match the new saved data
      setOriginalData({
        ...formData,
        logoUrl: newLogoUrl, // Make sure original data has new logo URL
        address: fullAddress,
        location: payload.location,
      });

      setFormData((prev) => ({ ...prev, logoUrl: newLogoUrl })); // Ensure form shows saved URL
      setSelectedLogoFile(null); // Clear the selected file

      // refetchUser(); // Uncomment if you have this from AuthContext
      toast.success("Hospital profile updated successfully!");
      setIsEditing(false); // Exit edit mode
    } catch (err) {
      toast.error(err.message || "Update failed.");
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedLogoFile(file); // Save the file object

      setFormData((prev) => ({ ...prev, logoUrl: URL.createObjectURL(file) }));
    }
  };

  if (loading) return <div className="loading-message">Loading profile...</div>;
  if (error)
    return <p className="error-message">Error loading profile: {error}</p>;

  return (
    <div className="hospital-profile-page">
      <div className="page-header">
        {" "}
        {/* Added a div for header and button */}
        <h2 className="page-title">Hospital Profile</h2>
        {!isEditing && ( // Show Edit button only when not editing
          <button
            className="edit-profile-btn"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        )}
      </div>
      <p className="page-subtitle">
        Manage and update the hospital's general information.
      </p>

      <form onSubmit={handleSubmit}>
        {/* Basic Information Card */}
        <div className="profile-card">
          <h4>Basic Information</h4>
          <div className="profile-form-grid">
            <div className="form-group grid-span-2">
              <label htmlFor="name">Hospital Name</label>
              {isEditing ? (
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              ) : (
                <p className="read-only-field">{formData.name || "N/A"}</p>
              )}
            </div>
            <div className="form-group grid-span-2">
              <label>Hospital Logo</label>
              {isEditing ? (
                <>
                  <input
                    type="file" // <-- Change this
                    id="logoFile"
                    name="logoFile"
                    accept="image/*" // <-- Add this
                    onChange={handleFileChange} // <-- Add this
                  />
                  {formData.logoUrl && (
                    <img
                      src={formData.logoUrl}
                      alt="Logo Preview"
                      className="hospital-logo-preview"
                      style={{ marginTop: "10px" }}
                    />
                  )}
                </>
              ) : (
                <div className="logo-display">
                  {formData.logoUrl ? (
                    <img
                      src={formData.logoUrl}
                      alt="Hospital Logo"
                      className="hospital-logo-preview"
                    />
                  ) : (
                    <p className="read-only-field">No logo uploaded</p>
                  )}
                </div>
              )}
            </div>
            <div className="form-group grid-span-2">
              <label htmlFor="street">Street Address</label>
              {isEditing ? (
                <input
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  required
                />
              ) : (
                <p className="read-only-field">{formData.street || "N/A"}</p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="city">City</label>
              {isEditing ? (
                <input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              ) : (
                <p className="read-only-field">{formData.city || "N/A"}</p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="state">State / Province</label>
              {isEditing ? (
                <input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
              ) : (
                <p className="read-only-field">{formData.state || "N/A"}</p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="zipCode">ZIP / Postal Code</label>
              {isEditing ? (
                <input
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                />
              ) : (
                <p className="read-only-field">{formData.zipCode || "N/A"}</p>
              )}
            </div>
          </div>
        </div>

        {/* Contact Details Card */}
        <div className="profile-card">
          <h4>Contact Details</h4>
          <div className="profile-form-grid">
            <div className="form-group">
              <label htmlFor="contactPhone">Main Phone Number</label>
              {isEditing ? (
                <input
                  id="contactPhone"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  placeholder="(555) 123-4567"
                />
              ) : (
                <p className="read-only-field">
                  {formData.contactPhone || "N/A"}
                </p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="contactEmail">General Inquiries Email</label>
              {isEditing ? (
                <input
                  id="contactEmail"
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  placeholder="contact@hospital.com"
                />
              ) : (
                <p className="read-only-field">
                  {formData.contactEmail || "N/A"}
                </p>
              )}
            </div>
            <div className="form-group grid-span-2">
              <label htmlFor="websiteUrl">Official Website URL</label>
              {isEditing ? (
                <input
                  id="websiteUrl"
                  name="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={handleInputChange}
                  placeholder="https://www.hospital.com"
                />
              ) : (
                <p className="read-only-field">
                  {formData.websiteUrl ? (
                    <a
                      href={formData.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {formData.websiteUrl}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* About Card */}
        <div className="profile-card">
          <h4>About the Hospital</h4>
          <div className="form-group">
            <label htmlFor="about">Hospital Description</label>
            {isEditing ? (
              <textarea
                id="about"
                name="about"
                value={formData.about}
                onChange={handleInputChange}
                placeholder="Enter a description..."
              />
            ) : (
              <p className="read-only-field">{formData.about || "N/A"}</p>
            )}
          </div>
        </div>

        {/* Services Card */}
        <div className="profile-card">
          <h4>Services Offered</h4>
          <div className="form-group">
            <label htmlFor="serviceInput">Add or remove medical services</label>
            {isEditing ? (
              <div className="services-input-container">
                <input
                  id="serviceInput"
                  className="services-input"
                  value={serviceInput}
                  onChange={handleServiceInputChange}
                  onKeyDown={handleAddService}
                  placeholder="Add a service and press Enter"
                />
              </div>
            ) : (
              <p className="read-only-field">
                {formData.services.length > 0
                  ? formData.services.join(", ")
                  : "No services listed"}
              </p>
            )}
            <div className="services-tags-display">
              {isEditing &&
                formData.services.map((service, index) => (
                  <span key={index} className="service-tag-item">
                    {service}
                    <button
                      type="button"
                      onClick={() => handleRemoveService(service)}
                    >
                      &times;
                    </button>
                  </span>
                ))}
            </div>
          </div>
        </div>

        {isEditing && ( // Show action buttons only when editing
          <div className="profile-actions">
            <button type="button" className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save Changes
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default HospitalProfile;
