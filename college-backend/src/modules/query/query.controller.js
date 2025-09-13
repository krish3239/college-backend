import { createEnquiry, getEnquiries } from "./query.service.js";

// Controller to handle a new enquiry form submission
export const create = async (req, res, next) => {
  try {
    const enquiryData = req.body;

    // Call the service to create a new enquiry
    const newEnquiry = await createEnquiry(enquiryData);

    res.status(201).json({ 
      success: true,
      message: "Enquiry submitted successfully", 
      data: newEnquiry 
    });
  } catch (err) {
    // Pass the error to the Express error-handling middleware
    next(err);
  }
};

// Controller to get all enquiry form submissions
export const getAll = async (req, res, next) => {
  try {
    // Call the service to retrieve all enquiries
    const allEnquiries = await getEnquiries();

    res.status(200).json({ 
      success: true,
      data: allEnquiries 
    });
  } catch (err) {
    // Pass the error to the Express error-handling middleware
    next(err);
  }
};
