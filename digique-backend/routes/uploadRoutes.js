const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const hospitalAdminAuth = require("../middleware/hospitalAdminAuth.js");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/hospital-logos/"); // The folder we created
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${req.hospitalId}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("Only images (jpeg, jpg, png, gif) are allowed!"));
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: fileFilter,
});

router.post(
  "/hospital-logo",
  hospitalAdminAuth, // Protect this route
  upload.single("logo"), 
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded." });
    }

    const imageUrl = `/uploads/hospital-logos/${req.file.filename}`;
    res.json({ msg: "Logo uploaded successfully!", imageUrl: imageUrl });
  }
);

module.exports = router;
