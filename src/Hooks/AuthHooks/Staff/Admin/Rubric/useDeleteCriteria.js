import { useState, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const useDeleteCriteria = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const role = useSelector((store) => store.Auth.role);

  const deleteCriteria = useCallback(
    async (rubricId, criteriaId) => {
      setLoading(true);
      setError(null);
      try {
        const API_URL = process.env.REACT_APP_API_URL;
        const token = localStorage.getItem(`${role}:token`);
        await axios.delete(
          `${API_URL}/admin/rubric/${rubricId}/criteria/${criteriaId}`,
          {
            headers: { Authentication: token },
          }
        );

        setLoading(false);
        toast.success("Criteria deleted successfully");
        return { success: true };
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to delete criteria";
        toast.error(errorMessage);
        setLoading(false);
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [role]
  );

  return { deleteCriteria, loading, error };
};

export default useDeleteCriteria;
