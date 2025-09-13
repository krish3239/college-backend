import express from "express";
import { create, getAll } from "./query.controller.js";

const router = express.Router();

// Route to submit a new enquiry form
router.post("/", create);

// Route to get all enquiries
router.get("/", getAll);

export default router;
