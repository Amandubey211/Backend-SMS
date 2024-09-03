import React, { useEffect, useState } from "react";
import useFetchCommentsByAnnouncement from "../../../../../../../Hooks/AuthHooks/Staff/Admin/Announcement/Comments/useFetchCommentsByAnnouncement";
import AnnouncementCommentsHeader from "./Components/AnnouncementCommentsHeader";
import AnnouncementComment from "./Components/AnnouncementComment";
import AnnouncementInputComment from "./Components/AnnouncementInputComment";
import { FaRegCommentDots, FaSpinner } from "react-icons/fa"; // Import FaSpinner for loading
import useAddCommentToAnnouncement from "../../../../../../../Hooks/AuthHooks/Staff/Admin/Announcement/Comments/useAddCommentToAnnouncement";
import useAddReplyToAnnouncement from "../../../../../../../Hooks/AuthHooks/Staff/Admin/Announcement/Comments/useAddReplyToAnnouncement";
import useDeleteAnnouncementComment from "../../../../../../../Hooks/AuthHooks/Staff/Admin/Announcement/Comments/useDeleteAnnouncementComment";
import Spinner from "../../../../../../../Components/Common/Spinner";

const AnnouncementCommentSection = () => {
  const { comments, error, fetchComments, loading } =
    useFetchCommentsByAnnouncement();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [localComments, setLocalComments] = useState([]);

  const {
    addComment,
    loading: addCommentLoading,
    error: addCommentError,
  } = useAddCommentToAnnouncement();
  const {
    addReply,
    loading: addReplyLoading,
    error: addReplyError,
  } = useAddReplyToAnnouncement();
  const {
    deleteComment,
    loading: deleteCommentLoading,
    error: deleteCommentError,
  } = useDeleteAnnouncementComment();

  useEffect(() => {
    fetchComments();
  }, []);

  useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleRefresh = () => {
    fetchComments();
  };

  const handleAddComment = async (text) => {
    try {
      await addComment(text);
      fetchComments(); // Refresh comments after adding
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const addNestedReply = async (parentId, text) => {
    try {
      const newReply = await addReply(parentId, text);

      const updatedComments = localComments.map((comment) => {
        if (comment._id === parentId) {
          return { ...comment, replies: [newReply, ...comment.replies] };
        }
        return comment;
      });
      setLocalComments(updatedComments);
      setActiveReplyId(null);
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      // Optimistically update the state
      const updatedComments = localComments.filter(
        (comment) => comment._id !== commentId
      );
      setLocalComments(updatedComments);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  // Sorting comments: Admin comments first, then by likes within each group
  const sortedComments = [...localComments].sort((a, b) => {
    if (a.role === "admin" && b.role !== "admin") return -1;
    if (a.role !== "admin" && b.role === "admin") return 1;
    if (a.likes.length !== b.likes.length)
      return b.likes.length - a.likes.length;
    return 0;
  });

  const filteredComments = sortedComments.filter((comment) => {
    const searchInComment = comment.createdBy
      ? comment.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
      : false;
    const searchInReplies = comment.replies.some((reply) =>
      reply.createdBy
        ? reply.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
        : false
    );
    return searchInComment || searchInReplies;
  });

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-none h-[10%]">
        <AnnouncementCommentsHeader
          handleSearch={handleSearch}
          handleRefresh={handleRefresh}
        />
      </div>
      <div className="h-[70%] overflow-y-scroll no-scrollbar px-6">
        {loading && <Spinner />}
        {error && <p className="text-red-500">Error: {error}</p>}
        {!loading && !error && filteredComments.length === 0 && (
          <div className="text-center w-full mt-40">
            <FaRegCommentDots size={64} className="mx-auto text-gray-500" />
            <p className="mt-4 text-lg text-gray-500">No comments found</p>
          </div>
        )}
        {filteredComments.map((comment) => (
          <AnnouncementComment
            key={comment?._id}
            comment={comment}
            activeReplyId={activeReplyId}
            setActiveReplyId={setActiveReplyId}
            addNestedReply={addNestedReply} // Pass addNestedReply to AnnouncementComment
            handleDeleteComment={handleDeleteComment} // Pass handleDeleteComment to AnnouncementComment
          />
        ))}
      </div>
      <div className="flex-none h-[15%]">
        <AnnouncementInputComment addComment={handleAddComment} />
      </div>
    </div>
  );
};

export default AnnouncementCommentSection;
