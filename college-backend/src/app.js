import express from "express";
import cors from "cors";
import helmet from "helmet"
import morgan from "morgan";
import cookieParser from "cookie-parser"
import authRoutes from "./modules/auth/auth.routes.js"
import studentRoutes from "./modules/student/student.routes.js"
import studentResult from "./modules/result/result.routes.js"
import studentEnquiry from "./modules/query/query.routes.js"
import { connectDB } from "./config/db.js";
import dotenv from "dotenv"
dotenv.config()
connectDB()
const app = express();
app.use(cors({
  origin: "*", // your frontend URL
  credentials: true,               // allow cookies
}));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/student",studentRoutes)
app.use("/api/result",studentResult)
app.use("/api/enquiry",studentEnquiry)
app.get("/", (req, res) => {
  res.send("hello");
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});
export default app;
