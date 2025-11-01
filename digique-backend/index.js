require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const uploadRoutes = require("./routes/uploadRoutes");

// ... all routes ...

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/user"));
app.use("/api/hospitals", require("./routes/hospital"));
app.use("/api/doctors", require("./routes/doctor"));
app.use("/api/appointments", require("./routes/appointments.js"));
app.use("/api/feedback", require("./routes/feedback.js"));
app.use("/api/hospital", require("./routes/hospitalAdmin.js"));
app.use("/api/upload", uploadRoutes); 

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully.");
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
