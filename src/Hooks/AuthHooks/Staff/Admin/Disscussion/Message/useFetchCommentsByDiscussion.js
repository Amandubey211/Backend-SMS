import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const useFetchCommentsByDiscussion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);

  const API_URL = process.env.REACT_APP_API_URL;
  const { role } = useSelector((store) => store.Auth);
  const { did: discussionId } = useParams();
  const userId = useSelector((store) => store.Auth.userId);

  const fetchCommentsWithReadStatus = useCallback(
    async (commentIds) => {
      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.post(
          `${API_URL}/comments/readStatus`,
          { commentIds },
          {
            headers: { Authentication: token },
          }
        );

        return await Promise.all(
          response.data.comments.map(async (comment) => {
            const userReadStatus = comment.userStatus.find(
              (status) =>
                status.userId.toString() === userId.toString() &&
                status.userType === role
            );
            const isRead = userReadStatus ? userReadStatus.read : false;

            const nestedReplies = comment.replies.length
              ? await fetchCommentsWithReadStatus(comment.replies)
              : [];

            return {
              ...comment,
              isRead,
              replies: nestedReplies,
            };
          })
        );
      } catch (error) {
        toast.error("Failed to fetch comments with read status");
        setError("Failed to fetch comments with read status");
        return [];
      }
    },
    [API_URL, role, userId]
  );

  const fetchCommentsByDiscussion = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem(`${role}:token`);
      const response = await axios.get(
        `${API_URL}/admin/getDiscussionComment/${discussionId}`,
        {
          headers: { Authentication: token },
        }
      );

      if (response.data.status) {
        const topLevelComments = response.data.data;
        const commentsWithReadStatus = await fetchCommentsWithReadStatus(
          topLevelComments.map((comment) => comment._id)
        );
        setComments(commentsWithReadStatus);
      } else {
        toast.error("Failed to fetch comments");
        setError("Failed to fetch comments");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Error fetching comments";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [API_URL, role, discussionId, fetchCommentsWithReadStatus]);

  return { loading, error, fetchCommentsByDiscussion, comments };
};

export default useFetchCommentsByDiscussion;
