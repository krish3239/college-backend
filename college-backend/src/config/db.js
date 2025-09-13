import mongoose from "mongoose"
import Student from "../modules/student/student.model.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
       const indexes = await Student.collection.indexes();
    console.log("Indexes on students collection:", indexes);
  } catch (err) {
    console.error("❌ DB connection failed:", err.message);
    process.exit(1);
  }
};
 