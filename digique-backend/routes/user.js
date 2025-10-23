const express = require("express");
const authMiddleware = require("../middleware/auth.js");
const User = require("../models/User.js");
const UpdateHistory = require("../models/History.js");
const router = express.Router();

const formatFieldName = (key) => {
  return key.replace(/([A-Z])/g, " $1");
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
    if (!user)
      return res.status(404).json({
        msg: "User not Found",
      });
    const updates = req.body;
    const historyLogs = [];
    Object.keys(updates).forEach((key) => {
      const newValue = updates[key];
      const previousValue = user[key];

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
      } else if (
        previousValue != undefined &&
        String(previousValue) !== String(newValue)
      ) {
        if (key == "dateOfBirth") {
          const oldDate = new Date(previousValue).toLocaleDateString();
          const newDate = new Date(newValue).toLocaleDateString();
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
    console.error("Profile Update Error: ", error);
    res.status(500).send("Server Error");
  }
});

router.get("/me/history", authMiddleware, async (req, res) => {
  try {
    const history = (await UpdateHistory.find({ user: req.user.id })).toSorted({
      createdAt: -1,
    });
    res.json(history);
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;
