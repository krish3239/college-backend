import { generateTokens } from "../../utils/jwt.js";
import Student from "../student/student.model.js";
import User from "./auth.model.js"; // Make sure to import your User model

export const registerUser = async (email, password, role) => {
  // Check if a user with the provided email or phone already exists
  if (!email||email==="") {
    throw new Error("No Details Provided");
  }
 
  const exists=await User.findOne({email})
  console.log("the user is ", exists);
  if (exists) {
    throw new Error("User already exists");
  }

  // Create a new user with the provided details
  const student=new Student({email});
  await student.save();
  const user = new User({ email, password, role });
  await user.save();
  return user;
};
export const loginUser = async (email, password) => {

  const user=await User.findOne({email})


  // Check if user exists and if the provided password matches
  if (!user || user.password !== password) {
    throw new Error("Invalid credentials");
  }
  
  // You'll need a way to generate tokens. This part of the code is not provided.
  // Assuming generateTokens is a function you've created elsewhere.
  const tokens = generateTokens(user);
  return { user, tokens };
};
