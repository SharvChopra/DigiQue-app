const express = require("express");
const router = express.Router();
const hospitalAdminAuth = require("../middleware/hospitalAdminAuth.js"); // Import the middleware
const Appointment = require("../models/Appointment.js");
const Doctor = require("../models/Doctor.js");
const Hospital = require("../models/Hospital.js");

router.get("/overview-summary", hospitalAdminAuth, async (req, res) => {
  try {
    const hospitalId = req.hospitalId;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const weekEnd = new Date();
    weekEnd.setDate(todayStart.getDate() + 7);
    weekEnd.setHours(23, 59, 59, 999);

    const [
      todaysAppointmentsCount, // Use this name
      weekAppointmentsCount,
      totalDoctorsCount,
      upcomingAppointments,
      hospitalProfile,
    ] = await Promise.all([
      Appointment.countDocuments({
        hospital: hospitalId,
        date: { $gte: todayStart, $lte: todayEnd },
        status: "Scheduled",
      }),
      Appointment.countDocuments({
        hospital: hospitalId,
        date: { $gte: todayStart, $lte: weekEnd },
        status: "Scheduled",
      }),
      Doctor.countDocuments({ hospital: hospitalId }),
      Appointment.find({
        hospital: hospitalId,
        date: { $gte: todayStart },
        status: "Scheduled",
      })
        .sort({ date: 1 })
        .limit(3)
        .populate("patient", "firstName lastName")
        .populate("doctor", "name"),
      Hospital.findById(hospitalId).select("name about services"),
    ]);

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

router.get("/my-profile", hospitalAdminAuth, async (req, res) => {
  try {
    const hospitalId = req.hospitalId;
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({
        msg: "Hospital Profile not found for this admin.",
      });
    }
    res.json(hospital);
  } catch (error) {
    console.error("Error fetching hospital profile:", error);
    res.status(500).send("Server Error");
  }
});

router.put("/my-profile", hospitalAdminAuth, async (req, res) => {
  try {
    const hospitalId = req.hospitalId;
    const {
      name,
      address,
      location,
      about,
      services,
      logoUrl,
      contactPhone,
      contactEmail,
      websiteUrl,
    } = req.body;

    const updateFields = {};
    if (name) updateFields.name = name;
    if (address) updateFields.address = address;
    if (location) updateFields.location = location;
    if (about) updateFields.about = about;
    if (services) updateFields.services = services;
    if (logoUrl) updateFields.logoUrl = logoUrl;
    if (contactPhone) updateFields.contactPhone = contactPhone;
    if (contactEmail) updateFields.contactEmail = contactEmail;
    if (websiteUrl) updateFields.websiteUrl = websiteUrl;

    const updatedHospital = await Hospital.findByIdAndUpdate(
      hospitalId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );
    if (!updatedHospital) {
      return res.status(404).json({
        msg: "Hospital profile not found for the update",
      });
    }
    res.json(updatedHospital);
  } catch (error) {
    console.error("Error updating hospital Profile:", error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
