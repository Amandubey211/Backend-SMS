import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

const API_URL = process.env.REACT_APP_API_URL;

const useAssignClassToStudent = () => {
  const [loading, setLoading] = useState(false);

  const validateDetails = (details) => {
    if (!details || typeof details !== "object") {
      return "Invalid details object.";
    }

    const requiredFields = ["studentId", "presentClassId"];
    for (let field of requiredFields) {
      if (!details[field]) {
        return `Field ${field} is required.`;
      }
    }

    return null;
  };

  const assignClass = async (assignedDetails) => {
    const validationError = validateDetails(assignedDetails);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem(
        process.env.REACT_APP_ADMIN_TOKEN_STORAGE_KEY
      );
      const { data } = await axios.put(
        `${API_URL}/admin/assign_class`,
        assignedDetails,
        { headers: { Authentication: token } } // Changed 'Authentication' to 'Authorization'
      );

      if (data.success) {
        toast.success(data.msg || "Class assigned successfully");
      } else {
        toast.error(data.msg || "Class assignment failed");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg || "Something went wrong. Please try again.";
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    assignClass,
  };
};

export default useAssignClassToStudent;
