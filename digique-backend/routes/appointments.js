const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.js");

const Hospital = require("../models/Hospital.js");
const Appointment = require("../models/Appointment.js");
const Doctor = require("../models/Doctor.js");

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;
    const patientId = req.user.id;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ msg: "Doctor not found" });
    }
    const newAppointment = new Appointment({
      patient: patientId,
      doctor: doctorId,
      hospital: doctor.hospital,
      date,
      time,
    });

    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id })
      .populate("doctor", "name specialty")
      .populate("hospital", "name address")
      .sort({ date: -1 });

    console.log(
      "Fetched appointments for /me:",
      JSON.stringify(appointments, null, 2)
    );

    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    console.error("Error fetching /me appointments:", err.message); // Log the specific error
    res.status(500).send("Server Error");
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { date, time, status } = req.body; // New date/time for reschedule OR new status for cancel

    // Find the appointment by ID
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ msg: "Appointment not found" });
    }

    // Check if the logged-in user is the owner of the appointment
    if (appointment.patient.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    // --- Update Logic ---
    const updates = {};
    if (date) updates.date = date;
    if (time) updates.time = time;
    if (status) updates.status = status; // e.g., "Cancelled"

    // Perform the update
    appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true } // Return the updated document
    );

    res.json(appointment); // Send back the updated appointment
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
module.exports = router;
