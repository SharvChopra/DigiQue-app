const express = require("express");
const router = express.Router();
const Hospital = require("../models/Hospital.js");

router.get("/", async (req, res) => {
  try {
    const { location } = req.query; // Get location from query params (e.g., /api/hospitals?location=Ludhiana)
    const filter = {};

    if (location) {
      filter.location = { $regex: new RegExp(`^${location}$`, "i") };
    }

    const hospitals = await Hospital.find(filter); 
    res.json(hospitals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      return res.status(404).send({ message: "Hospital not found" });
    }
    res.send(hospital);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).send({ message: "Hospital not found" });
    }
    res.status(500).send({ message: err.message });
  }
});

module.exports = router;
