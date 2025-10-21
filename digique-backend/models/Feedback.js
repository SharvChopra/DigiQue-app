const mongoose = require("mongoose");
const { Schema } = mongoose; // Import Schema

const FeedbackSchema = new Schema(
  {
    subject: {
      type: String,
      required: [true, "Subject is required."], // Add validation message
      trim: true, // Remove leading/trailing whitespace
    },
    message: {
      type: String,
      required: [true, "Feedback message is required."],
      trim: true,
    },
    patient: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    hospital: {
      type: Schema.Types.ObjectId,
      ref: "Hospital", // Reference to the Hospital model
      required: false, // Make it optional as per the frontend logic
    },
    status: {
      type: String,
      enum: ["Open", "Reviewed", "Closed"], // Define possible statuses
      default: "Open", // Default status when created
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Feedback", FeedbackSchema);
