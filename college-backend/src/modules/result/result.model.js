import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  maxMarks: {
    type: Number,
    min: 0
  },
  obtainedMarks: {
    type: Number,
    min: 0,
  },
  grade: {
    type: String,
    enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F']
  }
});

const resultSchema = new mongoose.Schema({
  studentInfo: {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    rollNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    course: {
      type: String,
      required: true,
      trim: true
    },
    semester: {
      type: String,
      required: true,
      trim: true
    },
    session: {
      type: String,
      required: true,
      trim: true
    }
  },
  subjects: [subjectSchema],
  status: {
    type: String,
    required: true,
    enum: ['Pass', 'Fail']
  },
  totalMarks: {
    type: Number,
    default: 0
  },
  obtainedMarks: {
    type: Number,
    default: 0
  },
  percentage: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});


// Index for faster searches
resultSchema.index({ 'studentInfo.rollNumber': 1 });

export const Result = mongoose.model('Result', resultSchema);