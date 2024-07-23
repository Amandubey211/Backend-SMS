import { useState, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { baseUrl } from "../../../../../config/Common";

const useUpdateRubric = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const role = useSelector((store) => store.Auth.role);

  const updateRubric = useCallback(async (rubricId, rubricData) => {
    setLoading(true);
    setError(null);
    try {
      
      const token = localStorage.getItem(`${role}:token`);
      await axios.put(
        `${baseUrl}/admin/rubric/${rubricId}`,
        rubricData,
        {
          headers: { Authentication: token },
        }
      );

      setLoading(false);
      toast.success("Rubric updated successfully");
      return { success: true };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to update rubric";
      toast.error(errorMessage);
      setLoading(false);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [role]);

  return { updateRubric, loading, error };
};

export default useUpdateRubric;
