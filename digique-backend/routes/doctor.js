const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor.js");
const Appointment = require("../models/Appointment.js");

router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.hospitalId) {
      filter.hospital = req.query.hospitalId;
    }
    const doctors = await Doctor.find(filter);
    res.send(doctors);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});

router.get("/:id/availability", async (req, res) => {
  try {
    const { date } = req.query; // e.g., "2025-11-01"
    if (!date) {
      return res.status(400).json({ msg: "Date query parameter is required" });
    }

    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ msg: "Doctor not found" });
    } // --- 1. Get the schedule for the requested day ---

    const requestedDate = new Date(date);
    const dayOfWeek = requestedDate
      .toLocaleString("en-US", { weekday: "long" })
      .toLowerCase();
    // Get the schedule from the object (e.g., doctor.schedule.monday)
    const scheduleDay = doctor.schedule[dayOfWeek];

    if (!scheduleDay || !scheduleDay.isAvailable) {
      return res.json([]); // Doctor is not available, return empty array
    } // --- 2. Generate all possible slots for that day ---

    const { startTime, endTime } = scheduleDay;
    const { appointmentDuration } = doctor.schedule; // Get duration
    const allSlots = [];

    // Use UTC to avoid timezone issues
    const start = new Date(`${date}T${startTime}:00Z`);
    const end = new Date(`${date}T${endTime}:00Z`);

    let currentSlot = start;

    while (currentSlot < end) {
      // Format as "10:00"
      allSlots.push(
        currentSlot.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "UTC",
        })
      );
      currentSlot.setMinutes(currentSlot.getMinutes() + appointmentDuration);
    } // --- 3. Find already booked slots ---

    const startDate = new Date(date);
    startDate.setUTCHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setUTCHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
      doctor: req.params.id,
      date: {
        // 'date' is the field in your AppointmentSchema
        $gte: startDate,
        $lt: endDate,
      },
    }); // 'time' is the field in your AppointmentSchema (e.g., "10:00")

    const bookedTimes = new Set(appointments.map((appt) => appt.time)); // --- 4. Filter and return available slots ---

    const availableSlots = allSlots.filter((slot) => !bookedTimes.has(slot));

    res.json(availableSlots);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
