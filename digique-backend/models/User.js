const mongoose = require("mongoose");
const { Schema } = mongoose;

const AddressSchema = new Schema(
  {
    street: String,
    city: String,
    state: String,
    zipCode: String,
  },
  { _id: false }
);
const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String },
    location: { type: String },
    role: {
      type: String,
      enum: ["PATIENT", "HOSPITAL"],
      required: true,
    },
    dateOfBirth: { type: Date },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", "Prefer not to say"],
    },
    address: { type: AddressSchema },
    emergencyContact: {
      name: String,
      phone: String,
    },
    managedHospital: {
      type: Schema.Types.ObjectId,
      ref: "Hospital",
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
