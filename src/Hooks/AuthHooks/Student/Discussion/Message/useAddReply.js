import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../../../../config/Common";

const useAddReply = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { role } = useSelector((store) => store.Auth);
  const { did: discussionId } = useParams();

  const addReply = useCallback(
    async (parentId, text) => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.post(
          `${baseUrl}/admin/createCommentDiscussion/${discussionId}/replies`,
          { content: text, parentId },
          {
            headers: { Authentication: token },
          }
        );

        if (response.data.status) {
          toast.success("Reply added successfully");
          return response.data.data; // Return the added reply data
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
    [discussionId, role]
  );

  return { loading, error, addReply };
};

export default useAddReply;
