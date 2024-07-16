import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const useDeleteReply = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;
  const { role } = useSelector((store) => store.Auth);

  const deleteReply = useCallback(async (replyId) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem(`${role}:token`);
      const response = await axios.delete(
        `${API_URL}/deleteCommentDiscussion/${replyId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
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
  }, [API_URL, role]);

  return { loading, error, deleteReply };
};

export default useDeleteReply;
