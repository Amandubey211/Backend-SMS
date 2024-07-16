import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const useReplyDiscussion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reply, setReply] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;
  const { role, userId, userSchoolId } = useSelector((store) => store.Auth);
  const { id: discussionId } = useParams();

  const replyDiscussion = useCallback(async (content, parentId, files) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem(`${role}:token`);
      const formData = new FormData();
      formData.append("content", content);
      formData.append("parentId", parentId);
      if (files && files.attachment) {
        formData.append("attachment", files.attachment);
      }

      const response = await axios.post(
        `${API_URL}/createCommentDiscussion/${discussionId}/replies`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status) {
        setReply(response.data.data);
        toast.success("Reply added successfully");
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
  }, [API_URL, role, discussionId]);

  return { loading, error, replyDiscussion, reply };
};

export default useReplyDiscussion;
