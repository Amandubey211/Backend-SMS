import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { baseUrl } from "../../../config/Common";

const useSaveDetails = () => {
  const [loading, setLoading] = useState(false);

  const saveDetails = async (formData) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${baseUrl}/student/student_register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setLoading(false);

      if (response.data.success) {
        toast.success(
          response.data.msg || "Student details saved successfully!"
        );
        return response.data;
      } else {
        // Handle known error responses from the server
        toast.error(response.data.msg || "Failed to save student details.");
        return response.data;
      }
    } catch (error) {
      setLoading(false);
      // Check if the error is a server error
      if (error.response) {
        // The request was made, and the server responded with a status code
        // that falls out of the range of 2xx
        toast.error(error.response.data.msg || "Server error occurred.");
        console.error("Server error:", error.response.data);
      } else if (error.request) {
        // The request was made, but no response was received
        toast.error("No response from the server. Please try again later.");
        console.error("No response:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.error("Error setting up request.");
        console.error("Error setting up request:", error.message);
      }
    }
  };

  return {
    loading,
    saveDetails,
  };
};

export default useSaveDetails;
