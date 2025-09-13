import User from "../auth/auth.model.js";
import Student from "./student.model.js";

export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({ isActive: true });
    res.json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export  const getStudentByQuery = async (req, res) => {
  try {
    const { query } = req.params;
    console.log("the user in controller is ",req.user)
    if(req.user.role==="student")
    {
      if(req.user.email!=query)
      {
        return res.status(403).json({ message: "Forbidden" });
      }
    }
    // console.log("-----------------passed checks-----------")
    const student = await Student.findOne({
      $or: [
        { email: query }
      ],
      isActive: true
    });
// console.log("-----------------passed checks after finding student-----------")
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ success: true, data: student });
  } catch (error) {
    console.log("the error in controller is ",error)
    res.status(500).json({ message: error.message });
  }
};

export const createStudent = async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json({ success: true, data: student });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Student already exists with this email/phone/roll number' });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { email } = req.params;
      // Prevent email overwrite
    if ("email" in req.body) {
      delete req.body.email;
    }
      Object.keys(req.body).forEach((key) => {
      if (req.body[key] === "") {
        delete req.body[key];
      }
    });
    const student = await Student.findOneAndUpdate(
      { email },        // match by email
      { $set: req.body }, // update only the provided fields
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    const rollNumber=req.body.rollNumber
     const loginUser = await User.findOneAndUpdate(
      { email },        // match by email
      { $set: { rollNumber: rollNumber } },
      { new: true, runValidators: true }
    );
    res.json({ success: true, data: student });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.email,
      { isActive: false },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
