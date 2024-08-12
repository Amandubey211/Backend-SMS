import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../../../../../../../config/Common";
import CommentsHeader from "./CommentsHeader";
import CommentSection from "./CommentSection";
import InputComment from "./InputComment";
import toast from "react-hot-toast";
import { ImSpinner3 } from "react-icons/im";

const AnnouncementMessage = ({ announcement }) => {
  const { _id } = useParams(); // Assuming announcementId is passed via params
  const [comments, setComments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [activeReplyParentId, setActiveReplyParentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const announcementId=announcement._id
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);

      try {
        const token = localStorage.getItem("student:token");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await fetch(
          `${baseUrl}/admin/getAnnouncementComment/${announcement._id}`,
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
        console.log("announcement comments", data);

        if (data.status) {
          const formattedComments = data.data.map((comment) => ({
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
            isRead: comment.isRead,
          }));

          setComments(formattedComments);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [announcement._id]);

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
      isRead: reply.isRead,
    }));
  };

  const addComment = async (text) => {
    try {
      const token = localStorage.getItem("student:token");
      const response = await fetch(
        `${baseUrl}/admin/createCommentAnnouncement/${announcement._id}/replies`,
        {
          method: "POST",
          headers: {
            Authentication: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: text, parentId: null }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to add comment, status: ${response.status}`);
      }

      const data = await response.json();
      if (data.status) {
        const newComment = {
          id: data.data._id,
          author: data.data.createdBy,
          role: data.data.role,
          time: new Date(data.data.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          text: data.data.content,
          likes: data.data.likes.length,
          avatarUrl: data.data.profile,
          replies: [],
          isUserCreated: true,
        };
        setComments([newComment, ...comments]);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const addNestedReply = async (id, text) => {
    try {
      const token = localStorage.getItem("student:token");
      const response = await fetch(
        `${baseUrl}/admin/createCommentAnnouncement/${announcement._id}/replies`,
        {
          method: "POST",
          headers: {
            Authentication: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: text, parentId: id }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to add reply, status: ${response.status}`);
      }

      const data = await response.json();
      if (data.status) {
        const newReply = {
          id: data.data._id,
          author: data.data.createdBy,
          role: data.data.role,
          time: new Date(data.data.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          text: data.data.content,
          likes: data.data.likes.length,
          avatarUrl: data.data.profile,
          replies: [],
          isUserCreated: true,
        };

        const addReplyRecursively = (comments) => {
          return comments.map((comment) => {
            if (comment.id === id) {
              return {
                ...comment,
                replies: [newReply, ...comment.replies],
              };
            } else if (comment.replies.length > 0) {
              return {
                ...comment,
                replies: addReplyRecursively(comment.replies),
              };
            }
            return comment;
          });
        };

        setComments(addReplyRecursively(comments));
        setActiveReplyId(null);
        setActiveReplyParentId(null);
      }
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem("student:token");
      const response = await fetch(
        `${baseUrl}/admin/deleteComment/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authentication: token,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete comment, status: ${response.status}`);
      }

      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId)
      );
      toast.success("Comment Deleted");
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const deleteReply = async (commentId, replyId) => {
    try {
      const token = localStorage.getItem("student:token");
      const response = await fetch(`${baseUrl}/admin/deleteReply/${replyId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete reply, status: ${response.status}`);
      }

      const deleteReplyRecursively = (comments) => {
        return comments.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: comment.replies.filter((reply) => reply.id !== replyId),
            };
          } else if (comment.replies.length > 0) {
            return {
              ...comment,
              replies: deleteReplyRecursively(comment.replies),
            };
          }
          return comment;
        });
      };

      setComments(deleteReplyRecursively(comments));
      toast.success("Reply Deleted");
    } catch (error) {
      console.error("Error deleting reply:", error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredComments = comments.filter((comment) => {
    const searchInComment = comment.author
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const searchInReplies = comment.replies.some((reply) =>
      reply.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return searchInComment || searchInReplies;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <ImSpinner3 className="w-12 h-12 animate-spin mb-3" />
        <p className="text-lg font-semibold">Loading announcements...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-none h-[10%]">
        <CommentsHeader handleSearch={handleSearch} />
      </div>
      <div className="h-[70%] overflow-y-scroll no-scrollbar px-6">
        <CommentSection
          comments={filteredComments}
          deleteComment={deleteComment}
          deleteReply={deleteReply}
          addNestedReply={addNestedReply}
          activeReplyId={activeReplyId}
          setActiveReplyId={setActiveReplyId}
          activeReplyParentId={activeReplyParentId}
          setActiveReplyParentId={setActiveReplyParentId}
        />
      </div>
      <div className="flex-none h-[15%]">
        <InputComment addComment={addComment} />
      </div>
    </div>
  );
};

export default AnnouncementMessage;
