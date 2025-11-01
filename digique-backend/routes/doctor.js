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
    const { date } = req.query; 
    if (!date) {
      return res.status(400).json({ msg: "Date query parameter is required" });
    }

    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ msg: "Doctor not found" });
    }

    const requestedDate = new Date(date);
    const dayOfWeek = requestedDate
      .toLocaleString("en-US", { weekday: "long" })
      .toLowerCase();
    const scheduleDay = doctor.schedule[dayOfWeek];

    if (!scheduleDay || !scheduleDay.isAvailable) {
      return res.json([]); 
    }

    const { startTime, endTime } = scheduleDay;
    const { appointmentDuration } = doctor.schedule; 
    const allSlots = [];

    const start = new Date(`${date}T${startTime}:00Z`);
    const end = new Date(`${date}T${endTime}:00Z`);

    let currentSlot = start;

    while (currentSlot < end) {
      allSlots.push(
        currentSlot.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "UTC",
        })
      );
      currentSlot.setMinutes(currentSlot.getMinutes() + appointmentDuration);
    } 

    const startDate = new Date(date);
    startDate.setUTCHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setUTCHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
      doctor: req.params.id,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    }); 

    const bookedTimes = new Set(appointments.map((appt) => appt.time)); 

    const availableSlots = allSlots.filter((slot) => !bookedTimes.has(slot));

    res.json(availableSlots);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
