import React from "react";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "./HospitalAdmin.css";

const HospitalProfile = () => {
  console.log("HospitalProfile component is rendering!");
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    zipCode: "", // Address components
    location: "", // Separate location/city field for search
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

  const apiURL = import.meta.env.VITE_BACKEND_API_URL;
  const fetchProfile = useCallback(async () => {
    console.log(
      "HospitalProfile: useEffect fetchProfile running. Token:",
      !!token
    );
    if (!token) return;
    try {
      setLoading(true);
      const response = await fetch(`${apiURL}/hospital/my-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // --- Log Fetch Status ---
      console.log(
        "HospitalProfile: fetch /my-profile status:",
        response.status
      );
      // --- End Log ---
      if (!response.ok) throw new Error("Failed to fetch hospital profile");
      const data = await response.json();

      // --- Log Fetch Data ---
      console.log("HospitalProfile: Profile data received:", data);
      // --- End Log ---

      // Basic parsing of address string into components (improve if needed)
      const addressParts = (data.address || "").split(",");
      const street = addressParts[0]?.trim() || "";
      const cityStateZip = addressParts.slice(1).join(",").trim(); // Join remaining parts
      const city = data.location || cityStateZip.split(" ")[0] || ""; // Use location or try to extract city
      // Placeholder logic for state/zip, needs refinement based on actual address format
      const state = "";
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

  // Input Handlers
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

  // Cancel Changes
  const handleCancel = () => {
    if (originalData) {
      setFormData(originalData); // Reset form to initially loaded data
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Reconstruct full address
      const fullAddress =
        `${formData.street}, ${formData.city}, ${formData.state} ${formData.zipCode}`
          .replace(/ ,|, $/g, "")
          .trim(); // Basic reconstruction
      const payload = {
        name: formData.name,
        address: fullAddress,
        location: formData.city || formData.location, // Prioritize city field if filled
        logoUrl: formData.logoUrl,
        contactPhone: formData.contactPhone,
        contactEmail: formData.contactEmail,
        websiteUrl: formData.websiteUrl,
        about: formData.about,
        services: formData.services,
      };

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
      const updatedData = await response.json();
      setOriginalData({
        ...formData,
        address: fullAddress,
        location: payload.location,
      });
      toast.success("Hospital profile updated successfully!");
    } catch (err) {
      toast.error(err.message || "Update failed.");
    }
  };

  console.log("HospitalProfile: Rendering with state:", {
    loading,
    error,
    hasFormData: !!formData.name,
  });

  if (loading) return <div>Loading profile...</div>;
  if (error)
    return <p style={{ color: "red" }}>Error loading profile: {error}</p>;
  // --- Log Before Returning JSX ---
  console.log("HospitalProfile: Rendering actual form JSX.");
  // --- End Log ---
  return (
    <div className="hospital-profile-page">
      <h2 className="page-title">Hospital Profile</h2>
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
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group grid-span-2">
              <label>Hospital Logo</label>
              {/* Simple URL input for logo for now */}
              <input
                id="logoUrl"
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleInputChange}
                placeholder="Enter URL for logo image"
              />
              {/* Add preview and upload button if implementing file upload later */}
            </div>
            <div className="form-group grid-span-2">
              <label htmlFor="street">Street Address</label>
              <input
                id="street"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="state">State / Province</label>
              <input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="zipCode">ZIP / Postal Code</label>
              <input
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Contact Details Card */}
        <div className="profile-card">
          <h4>Contact Details</h4>
          <div className="profile-form-grid">
            <div className="form-group">
              <label htmlFor="contactPhone">Main Phone Number</label>
              <input
                id="contactPhone"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleInputChange}
                placeholder="(555) 123-4567"
              />
            </div>
            <div className="form-group">
              <label htmlFor="contactEmail">General Inquiries Email</label>
              <input
                id="contactEmail"
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleInputChange}
                placeholder="contact@hospital.com"
              />
            </div>
            <div className="form-group grid-span-2">
              <label htmlFor="websiteUrl">Official Website URL</label>
              <input
                id="websiteUrl"
                name="websiteUrl"
                value={formData.websiteUrl}
                onChange={handleInputChange}
                placeholder="https://www.hospital.com"
              />
            </div>
          </div>
        </div>

        {/* About Card */}
        <div className="profile-card">
          <h4>About the Hospital</h4>
          <div className="form-group">
            <label htmlFor="about">Hospital Description</label>
            <textarea
              id="about"
              name="about"
              value={formData.about}
              onChange={handleInputChange}
              placeholder="Enter a description..."
            />
          </div>
        </div>

        {/* Services Card */}
        <div className="profile-card">
          <h4>Services Offered</h4>
          <div className="form-group">
            <label htmlFor="serviceInput">Add or remove medical services</label>
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
            <div className="services-tags-display">
              {formData.services.map((service, index) => (
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

        <div className="profile-actions">
          <button type="button" className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="save-btn">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default HospitalProfile;
