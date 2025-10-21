import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "./BookingModal.css";

export default function BookingModal({ doctor, isOpen, onClose }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(false);

  const { token } = useAuth();
  const apiURL = import.meta.env.VITE_BACKEND_API_URL;

  useEffect(() => {
    if (doctor && selectedDate) {
      const fetchAvailability = async () => {
        setLoading(true);
        const dateString = selectedDate.toISOString().split("T")[0];
        try {
          const response = await fetch(
            `${apiURL}/doctors/${doctor._id}/availability?date=${dateString}`
          );
          const data = await response.json();
          setAvailableTimes(data);
          setSelectedTime("");
        } catch (err) {
          toast.error("Failed to fetch availability.");
        } finally {
          setLoading(false);
        }
      };
      fetchAvailability();
    }
  }, [doctor, selectedDate, apiURL]);

  const handleBooking = async () => {
    if (!selectedTime) {
      toast.warn("Please select an available time slot.");
      return;
    }

    try {
      const response = await fetch(`${apiURL}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          doctorId: doctor._id,
          date: selectedDate,
          time: selectedTime,
        }),
      });

      if (!response.ok) throw new Error("Booking failed.");

      toast.success(
        `Appointment with ${doctor.name} booked for ${selectedTime}!`
      );
      onClose();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>
        <div className="modal-header">
          <h3>Book Appointment</h3>
        </div>
        <div className="doctor-details-box">
          <p>
            <strong>Doctor:</strong> {doctor.name}
          </p>
          <p>
            <strong>Specialization:</strong> {doctor.specialty}
          </p>
        </div>
        <div className="booking-form-group">
          <label>Select Date</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            minDate={new Date()}
          />
        </div>
        <div className="booking-form-group">
          <label>Select Time Slot</label>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            disabled={loading}
          >
            <option value="">
              {loading ? "Loading..." : "Choose available time"}
            </option>
            {availableTimes.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="confirm-btn" onClick={handleBooking}>
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}
