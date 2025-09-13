import express from "express"
import { createStudent, deleteStudent, getAllStudents, updateStudent,getStudentByQuery } from "./student.controller.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/auth.middleware.js";
const router = express.Router();

// Public routes (or protected based on requirements)
router.use(auth());
router.get('/search/:query', getStudentByQuery);
// Admin only routes
router.get('/', authorize('admin'), getAllStudents);
router.post('/', authorize('admin'), createStudent);
router.patch('/:email', authorize('admin'), updateStudent);
router.delete('/:email', authorize('admin'), deleteStudent);

export default router;