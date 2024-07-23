import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../../config/Common";

const useDeleteDiscussion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  
  const { role } = useSelector((store) => store.Auth);

  const deleteDiscussion = useCallback(
    async (discussionId) => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.delete(
          `${baseUrl}/admin/deleteDiscussion/${discussionId}`,
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
    [role, baseUrl]
  );

  return { loading, error, success, deleteDiscussion };
};

export default useDeleteDiscussion;
