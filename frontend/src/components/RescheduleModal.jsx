import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "./BookingModal.css"; // Reuse existing modal styles

export default function RescheduleModal({
  appointment,
  isOpen,
  onClose,
  onRescheduled,
}) {
  const [selectedDate, setSelectedDate] = useState(
    new Date(appointment?.date || Date.now())
  );
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(false);

  const { token } = useAuth();
  const apiURL = import.meta.env.VITE_BACKEND_API_URL;
  const doctor = appointment?.doctor; // Get doctor from appointment prop

  useEffect(() => {
    if (doctor && selectedDate && isOpen) {
      const fetchAvailability = async () => {
        setLoading(true);
        const dateString = selectedDate.toISOString().split("T")[0];
        try {
          const response = await fetch(
            `${apiURL}/doctors/${doctor._id}/availability?date=${dateString}`
          );
          const data = await response.json();
          // Exclude the current appointment's time if it's on the same day
          const filteredTimes = data.filter(
            (time) =>
              !(
                new Date(appointment.date).toDateString() ===
                  selectedDate.toDateString() && time === appointment.time
              )
          );
          setAvailableTimes(filteredTimes);
          setSelectedTime("");
        } catch (err) {
          toast.error("Failed to fetch availability.");
        } finally {
          setLoading(false);
        }
      };
      fetchAvailability();
    }
  }, [doctor, selectedDate, isOpen, apiURL, appointment]);

  // Reset date when modal opens with a new appointment
  useEffect(() => {
    if (appointment) {
      setSelectedDate(new Date(appointment.date));
    }
  }, [appointment]);

  const handleReschedule = async () => {
    if (!selectedTime) {
      toast.warn("Please select an available time slot.");
      return;
    }

    try {
      const response = await fetch(
        `${apiURL}/appointments/${appointment._id}`,
        {
          method: "PUT", // Use PUT for update
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            date: selectedDate,
            time: selectedTime,
          }),
        }
      );

      if (!response.ok) throw new Error("Reschedule failed.");

      const updatedAppointment = await response.json();
      toast.success(`Appointment rescheduled to ${selectedTime}!`);
      onRescheduled(updatedAppointment); // Pass updated data back to parent
      onClose();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (!isOpen || !appointment) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>
        <div className="modal-header">
          <h3>Reschedule Appointment</h3>
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
          <label>Select New Date</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            minDate={new Date()}
          />
        </div>
        <div className="booking-form-group">
          <label>Select New Time Slot</label>
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
          <button className="confirm-btn" onClick={handleReschedule}>
            Confirm Reschedule
          </button>
        </div>
      </div>
    </div>
  );
}
