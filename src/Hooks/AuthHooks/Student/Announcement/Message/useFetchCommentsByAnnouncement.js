import { useState, useEffect } from "react";
// import { baseUrl } from "../../../../../config/Common";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../../config/Common";

export const useFetchCommentsByAnnouncement = (announcementId, setComments) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const studentId = useSelector((state) => state.Common.studentId);
  console.log("student id ", studentId);

  useEffect(() => {
    console.log("student id", studentId);
    const fetchComments = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("student:token");
        if (!token) throw new Error("Authentication token not found");

        const response = await fetch(
          `${baseUrl}/admin/getAnnouncementComment/${announcementId}`,
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
        console.log("data in hooks", data);
        if (data.status) {
          const formattedComments = data.data.map((comment) => ({
            id: comment._id,
            author: comment.createdBy,
            // authorID: comment.creatorID,
            authorID: comment.userId,
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

    fetchComments();
  }, [announcementId]);

  const formatReplies = (replies) => {
    return replies.map((reply) => ({
      id: reply._id,
      author: reply.createdBy,
      authorID: reply.userId,
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

  return { loading, error, studentId };
};
