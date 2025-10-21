const mongoose = require("mongoose");
const { Schema } = mongoose;

const DoctorSchema = new Schema(
  {
    name: { type: String, required: true },
    specialty: { type: String, required: true },
    profileImage: { type: String },
    hospital: { type: Schema.Types.ObjectId, ref: "Hospital", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", DoctorSchema);
