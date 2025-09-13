// auth.model.js
import mongoose from "mongoose";

const AuthSchema = new mongoose.Schema({
  email: { type: String, unique: true,required:true},
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "admin"], default: "student" },
  rollNumber:{type:String}
}, { timestamps: true });

const User = mongoose.model("User", AuthSchema);

export default User;