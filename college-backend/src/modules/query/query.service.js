import Enquiry from "./query.model.js";

export const createEnquiry = async (enquiryData) => {
  try {
    const { name, phone, courseType, course } = enquiryData;

    // Simple validation to ensure all required fields are present
    if (!name || !phone || !courseType || !course) {
      throw new Error("Missing required fields for enquiry submission.");
    }

    const newEnquiry = new Enquiry({
      name,
      phone,
      courseType,
      course,
    });

    await newEnquiry.save();
    return newEnquiry;
  } catch (error) {
    console.error("Error saving new enquiry:", error);
    throw new Error("Failed to submit enquiry. Please try again.");
  }
};

export const getEnquiries = async () => {
  try {
    const allEnquiries = await Enquiry.find({});
    return allEnquiries;
  } catch (error) {
    console.error("Error fetching all enquiries:", error);
    throw new Error("Failed to retrieve enquiries.");
  }
};
