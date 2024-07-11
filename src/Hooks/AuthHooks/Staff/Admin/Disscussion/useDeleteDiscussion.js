import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const useDeleteDiscussion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;
  const { role } = useSelector((store) => store.Auth);

  const deleteDiscussion = useCallback(
    async (discussionId) => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.delete(
          `${API_URL}/admin/deleteDiscussion/${discussionId}`,
          {
            headers: { Authentication: token },
          }
        );

        if (response.data.status) {
          setSuccess(true);
          toast.success(response.data.message);
        } else {
          toast.error("Failed to delete discussion");
          setError("Failed to delete discussion");
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Error deleting discussion";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [role, API_URL]
  );

  return { loading, error, success, deleteDiscussion };
};

export default useDeleteDiscussion;
