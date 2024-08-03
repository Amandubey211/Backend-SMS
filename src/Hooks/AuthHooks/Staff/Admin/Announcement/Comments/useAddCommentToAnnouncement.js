import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../../../../../config/Common";

const useAddCommentToAnnouncement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { role } = useSelector((store) => store.Auth);
  const { aid: announcementId } = useParams();

  const addComment = useCallback(
    async (text) => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.post(
          `${baseUrl}/admin/createCommentAnnouncement/${announcementId}/replies`,
          { content: text, parentId: null },
          {
            headers: { Authentication: token },
          }
        );

        if (response.data.status) {
          // handle success logic
        } else {
          toast.error("Failed to add comment");
          setError("Failed to add comment");
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Error adding comment";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [announcementId, role]
  );

  return { loading, error, addComment };
};

export default useAddCommentToAnnouncement;
