import { Link } from "react-router-dom";
import "./HospitalCard.css";

export default function HospitalCard({ hospital }) {
  return (
    <div className="hospital-card">
      <img
        src={hospital.bannerImage}
        alt={hospital.name}
        className="card-image"
      />
      <div className="card-content">
        <h3 className="card-title">{hospital.name}</h3>
        <p className="card-address">
          📍 {hospital.address}
        </p>
        <div className="services-tags">

          {hospital.services.slice(0, 4).map((service, index) => (
            <span key={index} className="service-tag">
              {service}
            </span>
          ))}
        </div>
        <div className="card-actions">
          <Link to={`/hospitals/${hospital._id}`} className="details-button">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
