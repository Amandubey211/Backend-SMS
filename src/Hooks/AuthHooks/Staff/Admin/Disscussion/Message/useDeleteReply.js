import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../../../config/Common";

const useDeleteReply = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { role } = useSelector((store) => store.Auth);

  const deleteReply = useCallback(
    async (replyId) => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.delete(
          `${baseUrl}/admin/deleteCommentDiscussion/${replyId}`,
          {
            headers: { Authentication: token },
          }
        );

        if (response.data.status) {
          toast.success("Reply deleted successfully");
        } else {
          toast.error("Failed to delete reply");
          setError("Failed to delete reply");
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Error deleting reply";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [baseUrl, role]
  );

  return { loading, error, deleteReply };
};

export default useDeleteReply;
