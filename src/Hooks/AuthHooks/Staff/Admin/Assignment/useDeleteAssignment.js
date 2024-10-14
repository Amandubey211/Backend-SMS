import { useState, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { baseUrl } from "../../../../../config/Common";

const useDeleteAssignment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const role = useSelector((store) => store.common.auth.role);

  const deleteAssignment = useCallback(
    async (assignmentId) => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem(`${role}:token`);

        const response = await axios.delete(
          `${baseUrl}/admin/delete_assignment/${assignmentId}`,
          {
            headers: { Authentication: token },
          }
        );

        const { data } = response.data;

        setLoading(false);
        toast.success("Assignment deleted successfully");
        return { success: true, data };
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to delete assignment";
        toast.error(errorMessage);
        setLoading(false);
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [role]
  );

  return { deleteAssignment, loading, error };
};

export default useDeleteAssignment;
