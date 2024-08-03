import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../../../config/Common";

const useToggleLikeAnnouncementComment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { role } = useSelector((store) => store.Auth);

  const toggleLikeComment = useCallback(
    async (commentId) => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.put(
          `${baseUrl}/admin/likeAnnouncementComment/${commentId}`,
          {},
          {
            headers: { Authentication: token },
          }
        );

        if (response.data.status) {
          // handle success logic
        } else {
          toast.error("Failed to like/unlike comment");
          setError("Failed to like/unlike comment");
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Error liking/unliking comment";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [role]
  );

  return { loading, error, toggleLikeComment };
};

export default useToggleLikeAnnouncementComment;
