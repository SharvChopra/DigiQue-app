const mongoose = require("mongoose");
const { Schema } = mongoose;

const UpdateHistorySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    field: { type: String, required: true },
    previousValue: { type: String, required: true },
    newValue: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UpdateHistory", UpdateHistorySchema);
