const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.js"); 
const Feedback = require("../models/feedback.js"); 

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { subject, message, hospitalId } = req.body;
    const patientId = req.user.id;

    if (!subject || !message) {
      return res.status(400).json({ msg: "Subject and message are required." });
    }

    const newFeedback = new Feedback({
      subject,
      message,
      patient: patientId,
      hospital: hospitalId ? hospitalId : null,
      status: "Open", 
    });

    await newFeedback.save();

    res.status(201).json({ msg: "Feedback submitted successfully!" });
  } catch (err) {
    console.error("Feedback submission error:", err.message);
    res.status(500).send("Server Error - Could not save feedback.");
  }
});


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
