import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../../../config/Common";

const useDeleteComment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { role } = useSelector((store) => store.Auth);

  const deleteComment = useCallback(
    async (commentId) => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.delete(
          `${baseUrl}/admin/deleteCommentDiscussion/${commentId}`,
          {
            headers: { Authentication: token },
          }
        );

        if (response.data.status) {
          toast.success("Comment deleted successfully");
        } else {
          toast.error("Failed to delete comment");
          setError("Failed to delete comment");
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Error deleting comment";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [baseUrl, role]
  );

  return { loading, error, deleteComment };
};

export default useDeleteComment;
