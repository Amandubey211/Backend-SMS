import { useState, useEffect } from "react";
import { baseUrl } from "../../../../../config/Common";
import { useSelector } from "react-redux";

export const useFetchCommentsByDiscussion = (discussionId, setComments) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const studentId = useSelector((state) => state.Common.studentId);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("student:token");
      if (!token) throw new Error("Authentication token not found");

      const response = await fetch(
        `${baseUrl}/admin/getDiscussionComment/${discussionId}`,
        {
          headers: {
            Authentication: token,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch comments, status: ${response.status}`
        );
      }

      const data = await response.json();
      if (data.status) {
        const formattedComments = data.data.map((comment) => ({
          id: comment._id,
          author: comment.createdBy,
          authorID: comment.creatorID,
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
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [discussionId]);

  const formatReplies = (replies) => {
    return replies.map((reply) => ({
      id: reply._id,
      author: reply.createdBy,
      authorID: reply.creatorID,
      role: reply.role,
      time: new Date(reply.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      text: reply.content,
      likes: reply.likes.length,
      avatarUrl: reply.profile,
      replies: reply.replies ? formatReplies(reply.replies) : [],
      isRead: reply.isRead,
    }));
  };

  return { loading, error, studentId, fetchComments };
};




