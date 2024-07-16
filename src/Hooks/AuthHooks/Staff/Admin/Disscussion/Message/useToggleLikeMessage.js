import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const useToggleLikeMessage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;
  const { role } = useSelector((store) => store.Auth);

  const toggleLikeMessage = useCallback(async (messageId) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem(`${role}:token`);
      const response = await axios.put(
        `${API_URL}/likeDiscussions/${messageId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.status) {
        setMessage(response.data.data);
        toast.success("Toggled like status successfully");
      } else {
        toast.error("Failed to toggle like status");
        setError("Failed to toggle like status");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Error toggling like status";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [API_URL, role]);

  return { loading, error, toggleLikeMessage, message };
};

export default useToggleLikeMessage;
