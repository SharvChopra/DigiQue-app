import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "./HelpFeedback.css"; 

export default function HelpFeedback() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [selectedHospital, setSelectedHospital] = useState(""); 
  const [hospitals, setHospitals] = useState([]); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { token } = useAuth();
  const apiURL = import.meta.env.VITE_BACKEND_API_URL;

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await fetch(`${apiURL}/hospitals`); 
        if (!response.ok) {
          throw new Error("Failed to fetch hospitals");
        }
        const data = await response.json();
        setHospitals(data); 
      } catch (err) {
        console.error("Error fetching hospitals for feedback:", err);
        toast.error("Could not load hospital list for feedback form.");
      }
    };
    fetchHospitals();
  }, [apiURL]); 

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    if (!subject || !message) {
      toast.warn("Please enter both subject and message.");
      return;
    }
    if (!selectedHospital) {
      toast.warn("Please select the relevant hospital.");
      return;
    }

    setIsSubmitting(true); 

    try {
      const payload = {
        subject,
        message,
        hospitalId: selectedHospital || null, 
      };

      const response = await fetch(`${apiURL}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json(); 

      if (!response.ok) {
        throw new Error(data.msg || "Failed to submit feedback.");
      }

      toast.success("Feedback submitted successfully!");
      setSubject("");
      setMessage("");
      setSelectedHospital("");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    {
      q: "How do I book an appointment?",
      a: "Navigate to the home page, find your desired hospital, view details, select a doctor, and click 'Book Appointment'. Choose an available date and time slot in the modal.",
    },
    {
      q: "Can I cancel an appointment?",
      a: "Yes, go to the 'Calendar' section, select the appointment you wish to cancel, and click the 'Cancel Appointment' button. Note that cancellations might be subject to hospital policies.",
    },
    {
      q: "How do I search for specific services?",
      a: "On the main dashboard ('Home' page), use the 'Select service' dropdown in the search bar to filter hospitals by the services they offer.",
    },
    {
      q: "What if I need emergency care?",
      a: "This platform is for scheduling non-urgent appointments. For emergencies, please call your local emergency number or go directly to the nearest emergency room.",
    },
  ];

  return (
    <div className="help-feedback-page">
      <h2 className="page-title">Help & Feedback</h2>
      <p className="page-subtitle">Get help or share your feedback with us</p>

      <div className="content-grid">
        <section className="faq-section">
          <h3>Frequently Asked Questions</h3>
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <details>
                <summary>{faq.q}</summary>
                <div className="faq-content">
                  <p>{faq.a}</p>
                </div>
              </details>
            </div>
          ))}
        </section>

        <section className="feedback-section">
          <h3> ✉️ Send Feedback</h3>
          <form onSubmit={handleSubmit} className="feedback-form">
            <div className="form-group">
              <label htmlFor="hospital">Relevant Hospital</label>
              <select
                id="hospital"
                value={selectedHospital}
                onChange={(e) => setSelectedHospital(e.target.value)}
                aria-label="Select relevant hospital"
              >
                <option value="">-- Select a Hospital --</option>
                {hospitals.map((hospital) => (
                  <option key={hospital._id} value={hospital._id}>
                    {hospital.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter subject"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Your Feedback</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what you think..."
                required
              />
            </div>

            <button type="submit" disabled={isSubmitting}>
              ✈️ {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </form>
        </section>
      </div>

      <section className="contact-section">
        <h3>Contact Us</h3>
        <div className="contact-details">
          <div className="contact-item">
            <h4>Email</h4>
            <p>support@digique.com</p>
          </div>
          <div className="contact-item">
            <h4>Phone</h4>
            <p>1-800-DIGIQUE</p>
          </div>
          <div className="contact-item">
            <h4>Hours</h4>
            <p>Mon-Fri: 9 AM - 6 PM</p>
          </div>
        </div>
      </section>
    </div>
  );
}
