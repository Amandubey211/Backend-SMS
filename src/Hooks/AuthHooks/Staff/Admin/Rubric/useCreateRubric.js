import { useState, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const useCreateRubric = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const role = useSelector((store) => store.Auth.role);

  const createRubric = useCallback(async (rubricData) => {
    setLoading(true);
    setError(null);
    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const token = localStorage.getItem(`${role}:token`);
      const response = await axios.post(
        `${API_URL}/admin/rubric`,
        rubricData,
        {
          headers: { Authentication: token },
        }
      );
      const { data } = response.data;

      setLoading(false);
      toast.success("Rubric created successfully");
      return { success: true, data };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to create rubric";
      toast.error(errorMessage);
      setLoading(false);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [role]);

  return { createRubric, loading, error };
};

export default useCreateRubric;
