const mongoose = require("mongoose");
const { Schema } = mongoose;
const HospitalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    location: { type: String },
    about: { type: String },
    bannerImage: { type: String },
    services: [{ type: String }],
    adminUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
    logoUrl: { type: String, default: "" },
    contactPhone: { type: String, default: "" },
    contactEmail: { type: String, default: "" },
    websiteUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hospital", HospitalSchema);
