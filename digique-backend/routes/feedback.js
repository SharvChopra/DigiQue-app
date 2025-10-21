const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.js"); // Your JWT authentication middleware
const Feedback = require("../models/feedback.js"); // Import the Feedback model

/**
 * @route   POST /api/feedback
 * @desc    Submit new feedback from an authenticated user
 * @access  Private
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    // Extract data from the request body
    const { subject, message, hospitalId } = req.body;
    // Get the authenticated user's ID from the middleware
    const patientId = req.user.id;

    // --- Input Validation ---
    if (!subject || !message) {
      // Use return to stop execution after sending response
      return res.status(400).json({ msg: "Subject and message are required." });
    }

    const newFeedback = new Feedback({
      subject,
      message,
      patient: patientId,
      hospital: hospitalId ? hospitalId : null,
      status: "Open", 
    });

    // --- Save to Database ---
    await newFeedback.save();

    res.status(201).json({ msg: "Feedback submitted successfully!" });
  } catch (err) {
    console.error("Feedback submission error:", err.message);
    res.status(500).send("Server Error - Could not save feedback.");
  }
});

// --- Future Admin Route (Example) ---
// You would add another middleware here to check if the user is an admin
// router.get('/', adminAuthMiddleware, async (req, res) => {
//   try {
//     const feedbackList = await Feedback.find().populate('patient', 'firstName lastName email').populate('hospital', 'name');
//     res.json(feedbackList);
//   } catch (err) {
//     console.error("Error fetching feedback:", err.message);
//     res.status(500).send('Server Error');
//   }
// });

module.exports = router;
