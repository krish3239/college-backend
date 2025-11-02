import express from "express"
import { auth, authorize } from "../../middlewares/auth.middleware.js";
import  { ResultControllers } from "./result.controller.js";

// Assuming you have auth middleware
 // Assuming you have role check middleware

// Public routes (for students to view their results)
const router = express.Router();


// Protected routes (require authentication)
router.get('/student/:rollNumber', ResultControllers.getResultByRollNumber);
router.use(auth()); // Apply auth middleware to all routes below
// Admin only routes  
router.post('/', authorize("admin"), ResultControllers.createResult);
router.put('/:rollNumber',authorize("admin"), ResultControllers.updateResult);

router.get('/', authorize("admin"), ResultControllers.getAllResults);
router.delete('/:rollNumber',authorize("admin"), ResultControllers.deleteResult);
export default router;