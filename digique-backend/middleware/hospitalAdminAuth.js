const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

module.exports = async function (req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      message: "No token, authorization denied",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;

    const adminUser = await User.findById(req.user.id);
    if (!adminUser || adminUser.role !== "HOSPITAL") {
      return res
        .status(403)
        .json({ message: "User is not a hospital administrator" });
    }
    if (!adminUser.managedHospital) {
      return res
        .status(400)
        .json({ message: "Admin User is not linked to a Hospital" });
    }

    req.hospitalId = adminUser.managedHospital;
    next();
  } catch (err) {
    res.status(401).json({
      message: "Token is not Valid",
    });
  }
};
