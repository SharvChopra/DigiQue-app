const express = require("express");
const authMiddleware = require("../middleware/auth.js"); 
const User = require("../models/User.js"); 
const UpdateHistory = require("../models/History.js"); 
const router = express.Router();

const formatFieldName = (key) => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user /me:", error); 
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not Found" });

    const updates = req.body;
    const historyLogs = [];

    // --- Robust History Tracking ---
    Object.keys(updates).forEach((key) => {
      const newValue = updates[key];
      const previousValue = user[key];

      // Handle nested objects
      if (
        typeof newValue === "object" &&
        newValue !== null &&
        !Array.isArray(newValue)
      ) {
        Object.keys(newValue).forEach((nestedKey) => {
          const newNestedValue = newValue[nestedKey];
          const oldNestedValue = previousValue
            ? previousValue[nestedKey]
            : undefined;
          if (
            oldNestedValue !== undefined &&
            String(oldNestedValue) !== String(newNestedValue)
          ) {
            historyLogs.push({
              user: user._id,
              field: `${formatFieldName(key)} - ${formatFieldName(nestedKey)}`,
              previousValue: String(oldNestedValue),
              newValue: String(newNestedValue),
            });
          }
        });
      }
      // Handle simple fields
      else if (
        previousValue !== undefined &&
        String(previousValue) !== String(newValue)
      ) {
        if (key === "dateOfBirth") {
          const oldDate = previousValue
            ? new Date(previousValue).toLocaleDateString()
            : "Not Set";
          const newDate = newValue
            ? new Date(newValue).toLocaleDateString()
            : "Not Set";
          if (oldDate !== newDate) {
            historyLogs.push({
              user: user._id,
              field: formatFieldName(key),
              previousValue: oldDate,
              newValue: newDate,
            });
          }
        } else {
          historyLogs.push({
            user: user._id,
            field: formatFieldName(key),
            previousValue: String(previousValue),
            newValue: String(newValue),
          });
        }
      }
    });

    if (historyLogs.length > 0) {
      await UpdateHistory.insertMany(historyLogs);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (error) {
    console.error("Profile Update Error: ", error); // Keep logging
    res.status(500).send("Server Error");
  }
});

router.get("/me/history", authMiddleware, async (req, res) => {
  try {
    const history = await UpdateHistory.find({ user: req.user.id }).sort({
      createdAt: -1,
    }); 

    res.json(history);
  } catch (error) {
    console.error("Error fetching update history:", error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
