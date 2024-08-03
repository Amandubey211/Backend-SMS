import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../../../../../config/Common";

const useAddReplyToAnnouncement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { role } = useSelector((store) => store.Auth);
  const { aid: announcementId } = useParams();

  const addReply = useCallback(
    async (parentId, text) => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.post(
          `${baseUrl}/admin/createCommentAnnouncement/${announcementId}/replies`,
          { content: text, parentId }, // Pass parentId for the reply
          {
            headers: { Authentication: token },
          }
        );

        if (response.data.status) {
          return response.data.data; // Return the new reply
        } else {
          toast.error("Failed to add reply");
          setError("Failed to add reply");
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Error adding reply";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [announcementId, role]
  );

  return { loading, error, addReply };
};

export default useAddReplyToAnnouncement;
