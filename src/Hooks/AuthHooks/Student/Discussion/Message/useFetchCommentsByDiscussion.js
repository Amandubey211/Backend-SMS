import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../../../../config/Common";

const useFetchCommentsByDiscussion = () => {
  const { did: discussionId } = useParams();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("discussionId", discussionId);
      const token = localStorage.getItem("student:token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await axios.get(
        `${baseUrl}/admin/getDiscussionComment/${discussionId}`,
        {
          headers: { Authentication: token },
        }
      );

      if (response.data.status) {
        const formattedComments = response.data.data.map((comment) => ({
          id: comment._id,
          author: comment.createdBy,
          role: comment.role,
          time: new Date(comment.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          text: comment.content,
          likes: comment.likes.length,
          avatarUrl: comment.profile,
          replies: formatReplies(comment.replies),
          isUserCreated: false,
        }));

        setComments(formattedComments);
      } else {
        throw new Error("Failed to fetch comments");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching comments");
    } finally {
      setLoading(false);
    }
  }, [discussionId]);

  const formatReplies = (replies) => {
    return replies.map((reply) => ({
      id: reply._id,
      author: reply.createdBy,
      role: reply.role,
      time: new Date(reply.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      text: reply.content,
      likes: reply.likes.length,
      avatarUrl: reply.profile,
      replies: reply.replies ? formatReplies(reply.replies) : [],
    }));
  };

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return { comments, loading, error, fetchComments };
};

export default useFetchCommentsByDiscussion;
