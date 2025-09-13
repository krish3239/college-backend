// Enquiry.model.js
import mongoose from "mongoose";

const EnquirySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  phone: { 
    type: String, 
    required: true,
    trim: true 
  },
  courseType: { 
    type: String,
    required: true 
  },
  course: { 
    type: String, 
    required: true,
    trim: true 
  }
}, { timestamps: true });

const Enquiry = mongoose.model("Enquiry", EnquirySchema);

export default Enquiry;