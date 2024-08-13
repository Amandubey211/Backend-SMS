import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../../config/Common";

const useEditReply = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEdited, setIsEdited] = useState(false);

  const { role } = useSelector((store) => store.Auth);

  const editReply = useCallback(
    async (replyId, content) => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.put(
          `${baseUrl}/admin/editCommentDiscussion/${replyId}`,
          { content },
          {
            headers: { Authentication: token },
          }
        );

        if (response.data.status) {
          toast.success("Reply edited successfully");
          setIsEdited(true);
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
    },
    [role]
  );

  useEffect(() => {
    if (isEdited) {
      // Any additional logic on successful edit
    }
  }, [isEdited]);

  return { loading, error, editReply };
};

export default useEditReply;
