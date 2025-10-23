const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const Hospital = require("../models/Hospital.js");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      location,
      role,
    } = req.body;

    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({
        message: "Please fill in all required fields",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
      location,
      role: role.toUpperCase(),
    });

    if (newUser.role === "HOSPITAL") {
      const newHospital = new Hospital({
        name: `${firstName}'s Clinic` || "New Hospital Profile",
        address: location || "Please update address",
        location: location || "Please update location",
        about: "Please update description",
        services: [],
        adminUser: newUser._id,
      });

      const savedHospital = await newHospital.save();

      newUser.managedHospital = savedHospital._id;
    }

    await newUser.save();
    res
      .status(201)
      .json({ message: "User registered successfully.Please Sign in" });
  } catch (error) {
    console.error("Error in /register:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
