import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DoctorCard from "../components/DoctorCard";
import BookingModal from "../components/BookingModal";
import "./HospitalDetail.css";

export default function HospitalDetail() {
  const { id } = useParams(); 
  const [hospital, setHospital] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const apiURL = import.meta.env.VITE_BACKEND_API_URL;

  useEffect(() => {
    const fetchHospitalDetails = async () => {
      try {
        setLoading(true);
        // Fetch hospital details
        const hospitalRes = await fetch(`${apiURL}/hospitals/${id}`);
        const hospitalData = await hospitalRes.json();
        setHospital(hospitalData);

        // Fetch doctors for this hospital
        const doctorsRes = await fetch(`${apiURL}/doctors?hospitalId=${id}`);
        const doctorsData = await doctorsRes.json();
        setDoctors(doctorsData);
      } catch (err) {
        setError("Failed to load hospital details.");
      } finally {
        setLoading(false);
      }
    };
    fetchHospitalDetails();
  }, [id, apiURL]);

  const handleOpenModal = (doctor) => {
    setSelectedDoctor(doctor);

    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDoctor(null);
  };

  if (loading) return <p>Loading details...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="hospital-detail-page">
      {hospital && (
        <>
          <div className="hospital-banner">
            <img src={hospital.bannerImage} alt={hospital.name} />
            <div className="banner-overlay">
              <h2>{hospital.name}</h2>
              <p>{hospital.address}</p>
            </div>
          </div>

          <div className="hospital-content">
            <section className="about-section">
              <h3>About</h3>
              <p>{hospital.about}</p>
            </section>

            <section className="services-section">
              <h3>Services Offered</h3>
              <div className="services-tags">
                {hospital.services.map((service, index) => (
                  <span key={index} className="service-tag">
                    {service}
                  </span>
                ))}
              </div>
            </section>

            <section className="doctors-section">
              <h3>Our Doctors</h3>
              <div className="doctors-list">
                {doctors.map((doctor) => (
                  <DoctorCard
                    key={doctor._id}
                    doctor={doctor}
                    onBook={handleOpenModal}
                  />
                ))}
              </div>
            </section>
          </div>
        </>
      )}

      <BookingModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        doctor={selectedDoctor}
      />
    </div>
  );
}
