import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const useEditReply = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reply, setReply] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;
  const { role } = useSelector((store) => store.Auth);

  const editReply = useCallback(async (replyId, content) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem(`${role}:token`);
      const response = await axios.put(
        `${API_URL}/editCommentDiscussion/${replyId}`,
        { content },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.status) {
        setReply(response.data.data);
        toast.success("Reply edited successfully");
      } else {
        toast.error("Failed to edit reply");
        setError("Failed to edit reply");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Error editing reply";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [API_URL, role]);

  return { loading, error, editReply, reply };
};

export default useEditReply;
