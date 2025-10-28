import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "./ScheduleEditorModal.css";
import "./BookingModal.css";

const DAYS_OF_WEEK = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const ScheduleEditorModal = ({ isOpen, onClose, onSaveSuccess, doctor }) => {
  const { token } = useAuth();
  const [schedule, setSchedule] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const apiURL = import.meta.env.VITE_BACKEND_API_URL;

  useEffect(() => {
    if (doctor && doctor.schedule) {
      setSchedule(doctor.schedule);
    } else if (doctor) {
      setSchedule({
        monday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
        tuesday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
        wednesday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
        thursday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
        friday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
        saturday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
        sunday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
        appointmentDuration: 30,
      });
    }
  }, [doctor]);

  const handleDayChange = (dayKey, field, value) => {
    setSchedule((prevSchedule) => ({
      ...prevSchedule,
      [dayKey]: {
        ...prevSchedule[dayKey],
        [field]: value,
      },
    }));
  };

  const handleDurationChange = (e) => {
    const duration = parseInt(e.target.value, 10);
    setSchedule((prevSchedule) => ({
      ...prevSchedule,
      appointmentDuration: isNaN(duration) ? 0 : duration,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(
        `${apiURL}/hospital/doctors/${doctor._id}/schedule`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ schedule: schedule }),
        }
      );

      const updatedDoctor = await response.json();
      if (!response.ok) {
        throw new Error(updatedDoctor.msg || "Failed to save schedule");
      }

      toast.success("Schedule updated successfully!");
      onSaveSuccess();
      onClose();
    } catch (err) {
      console.error("Error saving schedule:", err);
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen || !schedule) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content schedule-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close-button"
          onClick={onClose}
          disabled={isSaving}
        >
          &times;
        </button>
        <h3 className="heading">Edit Schedule for {doctor.name}</h3>

        <div className="schedule-editor">
          {DAYS_OF_WEEK.map((dayKey) => {
            const dayData = schedule[dayKey] || {};

            return (
              <div key={dayKey} className="day-row">
                <div className="day-toggle">
                  <input
                    type="checkbox"
                    id={`check-${dayKey}`}
                    checked={dayData.isAvailable || false}
                    onChange={(e) =>
                      handleDayChange(dayKey, "isAvailable", e.target.checked)
                    }
                    disabled={isSaving}
                  />
                  <label htmlFor={`check-${dayKey}`}>
                    {capitalize(dayKey)}
                  </label>
                </div>
                <div
                  className="time-inputs"
                  style={{ display: dayData.isAvailable ? "flex" : "none" }}
                >
                  <input
                    type="time"
                    value={dayData.startTime || "09:00"}
                    onChange={(e) =>
                      handleDayChange(dayKey, "startTime", e.target.value)
                    }
                    disabled={!dayData.isAvailable || isSaving}
                  />
                  <span>to</span>
                  <input
                    type="time"
                    value={dayData.endTime || "17:00"}
                    onChange={(e) =>
                      handleDayChange(dayKey, "endTime", e.target.value)
                    }
                    disabled={!dayData.isAvailable || isSaving}
                  />
                </div>
              </div>
            );
          })}

          <div className="day-row duration-row">
            <label htmlFor="duration">Appointment Duration (minutes)</label>
            <input
              id="duration"
              type="number"
              step="5"
              min="5"
              value={schedule.appointmentDuration || 30}
              onChange={handleDurationChange}
              disabled={isSaving}
              className="duration-input"
            />
          </div>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            type="button"
            className="confirm-btn"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Schedule"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleEditorModal;
