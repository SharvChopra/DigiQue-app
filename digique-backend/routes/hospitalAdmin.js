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
      bannerImage,
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
    if (bannerImage) updateFields.bannerImage = bannerImage;
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

// MANAGE DOCTORS ROUTES
router.get("/my-doctors", hospitalAdminAuth, async (req, res) => {
  try {
    const hospitalId = req.hospitalId;
    const doctors = await Doctor.find({ hospital: hospitalId });
    res.json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).send("Server Error");
  }
});

router.post("/my-doctors", hospitalAdminAuth, async (req, res) => {
  const { name, speciality, profileImage } = req.body;
  const hospitalId = req.hospitalId;
  if (!name || !speciality) {
    return res.status(400).json({
      msg: "Name and Speciality are required Fields",
    });
  }
  try {
    const existingDoctor = await Doctor.findOne({
      name: name,
      hospital: hospitalId,
    });
    if (existingDoctor) {
      return res.status(400).json({
        msg: "A doctor with this name already exists in your hospital.",
      });
    }
    const newDoctor = new Doctor({
      name,
      specialty: speciality,
      profileImage: profileImage || "",
      hospital: hospitalId,
    });
    await newDoctor.save();
    res.status(201).json(newDoctor);
  } catch (error) {
    console.error("Error adding new doctor:", error);
    res.status(500).send("Server Error");
  }
});

//Basic Doctor Details Update
router.put("/doctors/:doctorId", hospitalAdminAuth, async (req, res) => {
  const { name, speciality, profileImage } = req.body;
  const hospitalId = req.hospitalId;
  try {
    let doctor = await Doctor.findById(req.params.doctorId);
    if (!doctor) {
      return res.status(404).json({
        msg: "Doctor not found",
      });
    }
    if (doctor.hospital.toString() !== hospitalId) {
      return res.status(403).json({
        msg: "Unauthorized to update this doctor",
      });
    }

    const updateFields = {};
    if (name) updateFields.name = name;
    if (speciality) updateFields.specialty = speciality;
    if (profileImage) updateFields.profileImage = profileImage;

    doctor = await Doctor.findByIdAndUpdate(
      req.params.doctorId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );
    res.json(doctor);
  } catch (error) {
    console.error("Error updating doctor:", error);
    res.status(500).send("Server Error");
  }
});

//DELETE DOCTOR ROUTE;
router.delete("/doctors/:doctorId", hospitalAdminAuth, async (req, res) => {
  const hospitalId = req.hospitalId;
  try {
    const doctor = await Doctor.findById(req.params.doctorId);
    if (!doctor) {
      return res.status(404).json({
        msg: "Doctor not found",
      });
    }
    if (doctor.hospital.toString() !== hospitalId) {
      return res.status(403).json({
        msg: "Unauthorized to update this doctor",
      });
    }
    await Doctor.findByIdAndDelete(req.params.doctorId);
    res.json({ msg: "Doctor deleted successfully" });
  } catch (error) {
    console.error("Error deleting doctor:", error);
    res.status(500).send("Server Error");
  }
});

//Adding Schedule Update Route
router.put(
  "/doctors/:doctorId/schedule",
  hospitalAdminAuth,
  async (req, res) => {
    const newSchedule = req.body.schedule;
    const hospitalId = req.hospitalId; 

    if (!newSchedule || typeof newSchedule !== "object") {
      return res.status(400).json({ msg: "Invalid schedule data provided." });
    }

    try {
      let doctor = await Doctor.findById(req.params.doctorId);
      if (!doctor) return res.status(404).json({ msg: "Doctor not found" });

      if (doctor.hospital.toString() !== hospitalId.toString()) {
        return res
          .status(401)
          .json({ msg: "Not authorized to modify this doctor's schedule" });
      }

      doctor.schedule = newSchedule;
      await doctor.save();

      res.json(doctor);
    } catch (error) {
      console.error("Error updating doctor schedule:", error);
      res.status(500).send("Server Error");
    }
  }
);

//Fetching the Appointments in the Admin Dashboard

module.exports = router;
