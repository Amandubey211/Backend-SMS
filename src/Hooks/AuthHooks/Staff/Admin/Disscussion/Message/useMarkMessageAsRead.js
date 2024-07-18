import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const useMarkMessageAsRead = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL;
  const { role } = useSelector((store) => store.Auth);

  const markMessageAsRead = useCallback(async (messageId) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem(`${role}:token`);
      const response = await axios.put(
        `${API_URL}/admin/markAsReadDiscussions/replies/${messageId}`,
        {},
        {
          headers: { Authentication: token },
        }
      );

      if (response.data.status) {
        toast.success("Message marked as read successfully");
      } else {
        toast.error("Failed to mark message as read");
        setError("Failed to mark message as read");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Error marking message as read";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [API_URL, role]);

  return { loading, error, markMessageAsRead };
};

export default useMarkMessageAsRead;
