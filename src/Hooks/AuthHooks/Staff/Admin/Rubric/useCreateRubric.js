import { useState, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const useCreateRubric = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const role = useSelector((store) => store.Auth.role);

  const validateRubricData = (rubricData) => {
    if (!rubricData.name) {
      return "Rubric name is required.";
    }
    if (!rubricData.criteria || rubricData.criteria.length === 0) {
      return "At least one criterion is required.";
    }
    if (!rubricData.assignmentId) {
      return "Assignment ID is required.";
    }
    return null;
  };

  const createRubric = useCallback(
    async (rubricData) => {
      setLoading(true);
      setError(null);

      const validationError = validateRubricData(rubricData);
      if (validationError) {
        toast.error(validationError);
        setLoading(false);
        return { success: false, error: validationError };
      }

      try {
        const API_URL = process.env.REACT_APP_API_URL;
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.post(
          `${API_URL}/admin/create_rubric`,
          rubricData,
          {
            headers: { Authentication: token },
          }
        );
        const { data } = response.data;
        setLoading(false);
        if (response?.data?.success) {
          toast.success("Rubric created successfully");
        } else {
          toast.error("Rubric Not created");
        }
        return { success: true, data };
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to create rubric";
        toast.error(errorMessage);
        setLoading(false);
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [role]
  );

  return { createRubric, loading, error };
};

export default useCreateRubric;
