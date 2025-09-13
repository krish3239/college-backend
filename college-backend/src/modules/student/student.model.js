import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      trim: true,
    },
    guardianName: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    address: {
      type: String,
    },
    phoneNumber: {
      type: String,
      match: /^[0-9]{10}$/,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    rollNumber: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Single", "Married"],
      default: "Single",
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    course: {
      type: String,
    },
    semester: {
      type: String,
    },
    session: {
      type: String,
    },
    admissionDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);


const Student= mongoose.model("Student", studentSchema);
export default Student;
