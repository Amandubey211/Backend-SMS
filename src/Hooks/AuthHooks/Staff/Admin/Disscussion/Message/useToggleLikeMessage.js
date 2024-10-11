import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../../../config/Common";

const useToggleLikeMessage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { role } = useSelector((store) => store.Auth);

  const toggleLikeMessage = useCallback(
    async (messageId) => {
      setLoading(true);
      setError(null);
      console.log(messageId, "sdfsdf");
      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.put(
          `${baseUrl}/admin/likeDiscussions/${messageId}`,
          {},
          {
            headers: { Authentication: token },
          }
        );

        if (response.data.status) {
          // do if success
        } else {
          toast.error("Failed to toggle like");
          setError("Failed to toggle like");
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Error toggling like";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [baseUrl, role]
  );

  return { loading, error, toggleLikeMessage };
};

export default useToggleLikeMessage;
