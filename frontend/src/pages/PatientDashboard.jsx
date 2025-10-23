import React, { useState, useEffect, useMemo } from "react";
import HospitalCard from "../components/HospitalCard";
import "./PatientDashboard.css";

export default function PatientDashboard() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState(
    "Getting your location..."
  );
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [geolocationAttempted, setGeolocationAttempted] = useState(false);
  const [displayTitle, setDisplayTitle] = useState("Find Healthcare Services");

  const [searchService, setSearchService] = useState("");
  const [searchHospitalName, setSearchHospitalName] = useState("");
  const [searchDoctorName, setSearchDoctorName] = useState("");

  const apiURL = import.meta.env.VITE_BACKEND_API_URL;

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setGeolocationAttempted(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        )
          .then((res) => res.json())
          .then((data) => {
            const city =
              data.address.city || data.address.town || data.address.village;
            setUserLocation(city || "Unknown Location");
            setGeolocationAttempted(true);
          })
          .catch(() => {
            setError(
              "Could not determine your location. Showing all hospitals."
            );
            setGeolocationAttempted(true);
          });
      },
      (err) => {
        setError("Location access denied. Showing all hospitals.");
        setGeolocationAttempted(true);
      }
    );
  }, []);

  useEffect(() => {
    if (!geolocationAttempted) return;
    const fetchHospitals = async () => {
      setLoading(true);
      let fetchedHospitals = [];
      if (userLocation) {
        setLoadingMessage(`Finding hospitals near ${userLocation}...`);
        const response = await fetch(
          `${apiURL}/hospitals?location=${userLocation}`
        );
        fetchedHospitals = await response.json();
        if (fetchedHospitals.length > 0) {
          setDisplayTitle(`Hospitals Near ${userLocation}`);
        }
      }
      if (fetchedHospitals.length === 0) {
        setLoadingMessage("Showing all available hospitals...");
        setDisplayTitle("All Available Hospitals");
        const response = await fetch(`${apiURL}/hospitals`);
        fetchedHospitals = await response.json();
      }
      setHospitals(fetchedHospitals);
      setLoading(false);
    };
    fetchHospitals();
  }, [userLocation, geolocationAttempted, apiURL]);

  const filteredHospitals = useMemo(() => {
    return hospitals.filter((hospital) => {
      const hospitalNameMatch = hospital.name
        .toLowerCase()
        .includes(searchHospitalName.toLowerCase());
      const serviceMatch = searchService
        ? hospital.services.some(
            (service) => service.toLowerCase() === searchService.toLowerCase()
          )
        : true;
      const doctorNameMatch = hospital.name
        .toLowerCase()
        .includes(searchDoctorName.toLowerCase());

      return hospitalNameMatch && serviceMatch && doctorNameMatch;
    });
  }, [hospitals, searchService, searchHospitalName, searchDoctorName]);

  return (
    <div className="dashboard-content">
      <h2 className="dashboard-title">{displayTitle}</h2>

      <section className="search-section">
        <div className="title-row">
          <h3>Search for hospitals, services, and doctors</h3>
          <button className="preview-booking-btn">Preview Booking</button>
        </div>
        <div className="search-inputs">
          <div className="input-group">
            <label htmlFor="select-service">⚙️</label>
            <select
              id="select-service"
              value={searchService}
              onChange={(e) => setSearchService(e.target.value)}
            >
              <option value="">Select service</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="MRI">MRI</option>
              <option value="CT Scan">CT Scan</option>
              <option value="General Checkup">General Checkup</option>
              <option value="Pediatrics">Pediatrics</option>
            </select>
          </div>
          <div className="input-group">
            <label htmlFor="search-hospital">🏥</label>
            <input
              type="text"
              id="search-hospital"
              placeholder="Search hospital name"
              value={searchHospitalName}
              onChange={(e) => setSearchHospitalName(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="search-doctor">👨‍⚕️</label>
            <input
              type="text"
              id="search-doctor"
              placeholder="Search doctor name"
              value={searchDoctorName}
              onChange={(e) => setSearchDoctorName(e.target.value)}
            />
          </div>
        </div>
      </section>

      {loading && <p>{loadingMessage}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <div className="hospital-list">
          {filteredHospitals.length > 0 ? (
            filteredHospitals.map((hospital) => (
              <HospitalCard key={hospital._id} hospital={hospital} />
            ))
          ) : (
            <p>No hospitals found matching your criteria.</p>
          )}
        </div>
      )}
    </div>
  );
}
