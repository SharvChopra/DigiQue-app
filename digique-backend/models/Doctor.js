const mongoose = require("mongoose");
const { Schema } = mongoose;

const dailyScheduleSchema = new Schema(
  {
    isAvailable: { type: Boolean, default: false },
    startTime: { type: String , default:"09:00"},
    endTime: { type: String , default:"17:00"},
  },
  { _id: false }
);

const DoctorSchema = new Schema(
  {
    name: { type: String, required: true },
    specialty: { type: String, required: true },
    profileImage: { type: String },
    hospital: { type: Schema.Types.ObjectId, ref: "Hospital", required: true },

    schedule: {
      monday: dailyScheduleSchema,
      tuesday: dailyScheduleSchema,
      wednesday: dailyScheduleSchema,
      thursday: dailyScheduleSchema,
      friday: dailyScheduleSchema,
      saturday: dailyScheduleSchema,
      sunday: dailyScheduleSchema,
      appointmentDuration: { type: Number, default: 30 }, // Default slot duration in minutes
    },
  },

  { timestamps: true }
);

DoctorSchema.pre("save", function (next) {
  if (this.isNew && !this.schedule) {
    this.schedule = {
      monday: { isAvailable: false },
      tuesday: { isAvailable: false },
      wednesday: { isAvailable: false },
      thursday: { isAvailable: false },
      friday: { isAvailable: false },
      saturday: { isAvailable: false },
      sunday: { isAvailable: false },
      appointmentDuration: 30,
    };
  }
  next();
});

module.exports = mongoose.model("Doctor", DoctorSchema);
