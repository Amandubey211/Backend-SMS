import { useState, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { baseUrl } from "../../../../../config/Common";

const useCreateAssignmentRubric = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const role = useSelector((store) => store.Auth.role);

  const validateRubricData = (rubricData) => {
    console.log(rubricData, "Create hook ");
    if (!rubricData.name) {
      return "Rubric name is required.";
    }
    if (!rubricData.criteria || rubricData.criteria.length === 0) {
      return "At least one criterion is required.";
    }
    if (!rubricData.assignmentId && !rubricData.quizId) {
      return "Either Assignment ID or Quiz ID is required.";
    }
    return null;
  };

  const createAssignmentRubric = useCallback(
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
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.post(
          `${baseUrl}/admin/create_rubric`,
          rubricData,
          {
            headers: { Authentication: token },
          }
        );

        if (response?.data?.success) {
          toast.success("Rubric created successfully");
          return { success: true, data: response.data };
        } else {
          const errorMessage = response?.data?.message || "Rubric not created";
          toast.error(errorMessage);
          return { success: false, error: errorMessage };
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to create rubric";
        toast.error(errorMessage);
        setError(errorMessage);
        setLoading(false);

        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [role]
  );

  return { createAssignmentRubric, loading, error };
};

export default useCreateAssignmentRubric;
