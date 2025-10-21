import React from "react";
import "./DoctorCard.css";

export default function DoctorCard({ doctor, onBook }) {
  return (
    <div className="doctor-card">
      <div className="doctor-avatar">
        <img src={doctor.profileImage} alt={doctor.name} />
      </div>
      <div className="doctor-info">
        <h4>{doctor.name}</h4>
        <p>{doctor.specialty}</p>
      </div>
      <div className="doctor-actions">
        <button className="book-button" onClick={() => onBook(doctor)}>
          Book Appointment
        </button>
      </div>
    </div>
  );
}
