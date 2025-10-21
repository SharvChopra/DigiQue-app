const mongoose = require("mongoose");
const HospitalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    location: { type: String },
    about: { type: String },
    bannerImage: { type: String },
    services: [{ type: String }],
    // adminUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hospital", HospitalSchema);
