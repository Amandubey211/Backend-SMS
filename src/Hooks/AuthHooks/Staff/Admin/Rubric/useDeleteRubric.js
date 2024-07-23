import { useState, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { baseUrl } from "../../../../../config/Common";

const useDeleteRubric = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const role = useSelector((store) => store.Auth.role);

  const deleteRubric = useCallback(async (rubricId) => {
    setLoading(true);
    setError(null);
    try {
      
      const token = localStorage.getItem(`${role}:token`);
      await axios.delete(
        `${baseUrl}/admin/rubric/${rubricId}`,
        {
          headers: { Authentication: token },
        }
      );

      setLoading(false);
      toast.success("Rubric deleted successfully");
      return { success: true };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete rubric";
      toast.error(errorMessage);
      setLoading(false);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [role]);

  return { deleteRubric, loading, error };
};

export default useDeleteRubric;
