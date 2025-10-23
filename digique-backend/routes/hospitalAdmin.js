const express = require("express");
const router = express.Router();
const hospitalAdminAuth = require("../middleware/hospitalAdminAuth.js"); // Import the middleware
const Appointment = require("../models/Appointment.js");
const Doctor = require("../models/Doctor.js");
const Hospital = require("../models/Hospital.js");

router.get("/overview-summary", hospitalAdminAuth, async (req, res) => {
  try {
    const hospitalI = req.hospitalId;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const weekEnd = new Date();
    weekEnd.setDate(todayStart.getDate() + 7);
    weekEnd.setHours(23, 59, 59, 999);

    const [
      todaysAppointmentCount,
      weekAppointmentsCount,
      totalDoctorsCount,
      upcomingAppointments,
      hospitalProfile,
    ] = await Promise.all([
      // Count appointments for today
      Appointment.countDocuments({
        hospital: hospitalId,
        date: { $gte: todayStart, $lte: todayEnd },
        status: "Scheduled", // Only count scheduled
      }),
      // Count appointments for the next week
      Appointment.countDocuments({
        hospital: hospitalId,
        date: { $gte: todayStart, $lte: weekEnd },
        status: "Scheduled",
      }),
      // Count total doctors for this hospital
      Doctor.countDocuments({ hospital: hospitalId }),
      // Get next 3 upcoming appointments
      Appointment.find({
        hospital: hospitalId,
        date: { $gte: todayStart },
        status: "Scheduled",
      })
        .sort({ date: 1 }) // Sort ascending by date
        .limit(3)
        .populate("patient", "firstName lastName") // Get patient name
        .populate("doctor", "name"), // Get doctor name
      // Get hospital profile to check if it's still using defaults
      Hospital.findById(hospitalId).select("name about services"),
    ]);

    // --- Check Profile Completeness (Example Check) ---
    const isProfileComplete =
      hospitalProfile &&
      hospitalProfile.about !== "Please update description" &&
      hospitalProfile.services.length > 0;

    const summary = {
      stats: {
        today: todaysAppointmentsCount,
        week: weekAppointmentsCount,
        doctors: totalDoctorsCount,
      },
      upcoming: upcomingAppointments,
      profileStatus: {
        isComplete: isProfileComplete,
        needsDoctors: totalDoctorsCount === 0,
      },
    };
    res.json(summary);
  } catch (error) {
    console.error("Error fetching overview summary:", error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
