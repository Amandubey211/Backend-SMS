import { useState, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const useAddCriteria = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const role = useSelector((store) => store.Auth.role);

  const addCriteria = useCallback(async (rubricId, criteriaData) => {
    setLoading(true);
    setError(null);
    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const token = localStorage.getItem(`${role}:token`);
      const response = await axios.post(
        `${API_URL}/admin/rubric/${rubricId}/criteria`,
        criteriaData,
        {
          headers: { Authentication: token },
        }
      );
      const { data } = response.data;

      setLoading(false);
      toast.success("Criteria added successfully");
      return { success: true, data };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to add criteria";
      toast.error(errorMessage);
      setLoading(false);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [role]);

  return { addCriteria, loading, error };
};

export default useAddCriteria;
