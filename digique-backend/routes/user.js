const express = require("express");
const authMiddleware = require("../middleware/auth.js"); 
const User = require("../models/User.js");
const router = express.Router();

router.get("/role", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ role: user.role, user });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
