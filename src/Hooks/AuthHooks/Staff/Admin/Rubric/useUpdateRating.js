import { useState, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const useUpdateRating = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const role = useSelector((store) => store.Auth.role);

  const updateRating = useCallback(async (rubricId, ratingData) => {
    setLoading(true);
    setError(null);
    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const token = localStorage.getItem(`${role}:token`);
      const response = await axios.put(
        `${API_URL}/admin/rubric/${rubricId}/rating`,
        ratingData,
        {
          headers: { Authentication: token },
        }
      );
      const { data } = response.data;

      setLoading(false);
      toast.success("Rating updated successfully");
      return { success: true, data };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to update rating";
      toast.error(errorMessage);
      setLoading(false);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [role]);

  return { updateRating, loading, error };
};

export default useUpdateRating;
