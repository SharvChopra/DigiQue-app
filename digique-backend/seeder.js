const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { hospitals, doctors } = require("./data/seedData.js");

// Import models
const Hospital = require("./models/Hospital.js");
const Doctor = require("./models/Doctor.js");

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected for seeding...");
  } catch (err) {
    console.error(`Error connecting to DB for seeding: ${err.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    for (const hospitalData of hospitals) {
      await Hospital.findOneAndUpdate(
        { name: hospitalData.name }, // The filter to find the document
        hospitalData, // The data to insert or update with
        { upsert: true, new: true } // Options: upsert=true creates if not found
      );
    }
    console.log("Hospitals upserted (updated or created).");

    // Fetch all hospitals again to get their IDs
    const allHospitals = await Hospital.find();

    // --- DOCTOR UPSERT LOGIC ---
    for (const doctorData of doctors) {
      const hospital = allHospitals.find(
        (h) => h.name === doctorData.hospitalName
      );
      if (hospital) {
        const doctorPayload = {
          name: doctorData.name,
          specialty: doctorData.specialty,
          profileImage: doctorData.profileImage,
          hospital: hospital._id,
        };

        await Doctor.findOneAndUpdate(
          { name: doctorData.name, hospital: hospital._id }, // Filter by name AND hospital
          doctorPayload,
          { upsert: true, new: true }
        );
      }
    }
    console.log("Doctors upserted (updated or created).");

    console.log("✅ Data Seeding Complete!");
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error}`);
    process.exit(1);
  }
};

connectDB().then(() => {
  importData();
});
