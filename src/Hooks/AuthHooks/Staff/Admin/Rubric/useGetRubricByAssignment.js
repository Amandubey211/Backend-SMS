import { useState, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { baseUrl } from "../../../../../config/Common";

const useGetRubricByAssignment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rubric, setRubric] = useState(null);
  const role = useSelector((store) => store.Auth.role);

  const getRubric = useCallback(
    async (assignmentId) => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.get(
          `${baseUrl}/admin/rubric/${assignmentId}`,
          {
            headers: { Authentication: token },
          }
        );
        console.log(response.data);
        if (response.data.success) {
          setRubric(response.data.rubric);
          return { success: true, rubric: response.data.rubric };
        }
        setLoading(false);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to fetch rubric";
        // toast.error(errorMessage);
        setLoading(false);
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [role]
  );

  return { getRubric, loading, error, rubric };
};

export default useGetRubricByAssignment;
