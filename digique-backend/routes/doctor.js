const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor.js");
const Appointment = require("../models/Appointment.js");

router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.hospital) {
      filter.hospital = req.query.hospital;
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
    const allSlots = [
      "09:00 AM",
      "10:00 AM",
      "11:00 AM",
      "12:00 PM",
      "02:00 PM",
      "03:00 PM",
      "04:00 PM",
      "05:00 PM",
    ];

    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(startDate.getDate() + 1);

    const appointments = await Appointment.find({
      doctor: req.params.id,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    const bookedTimes = appointments.map((appt) => appt.time);

    const availableSlots = allSlots.filter(
      (slot) => !bookedTimes.includes(slot)
    );

    res.json(availableSlots);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
