import React, { useEffect, useState } from "react";
import CommentSection from "./CommentSection";
import CommentsHeader from "./Components/CommentsHeader";
import InputComment from "./Components/InputComment";
import useAddComment from "../../../../../../Hooks/AuthHooks/Staff/Admin/Disscussion/Message/useAddComment";
import useAddReply from "../../../../../../Hooks/AuthHooks/Staff/Admin/Disscussion/Message/useAddReply";
import useDeleteComment from "../../../../../../Hooks/AuthHooks/Staff/Admin/Disscussion/Message/useDeleteComment";
import useDeleteReply from "../../../../../../Hooks/AuthHooks/Staff/Admin/Disscussion/Message/useDeleteReply";
import useFetchCommentsByDiscussion from "../../../../../../Hooks/AuthHooks/Staff/Admin/Disscussion/Message/useFetchCommentsByDiscussion";
import toast from "react-hot-toast";

const DiscussionMessage = () => {
  const { addComment: addNewComment } = useAddComment();
  const { addReply: addNewReply } = useAddReply();
  const { deleteComment: deleteExistingComment } = useDeleteComment();
  const { deleteReply: deleteExistingReply } = useDeleteReply();
  const { comments, error, fetchComments, loading } =
    useFetchCommentsByDiscussion();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [localComments, setLocalComments] = useState([]);

  useEffect(() => {
    fetchComments();
  }, []);

  useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  useEffect(() => {
    return () => {
      fetchComments();
    };
  }, []);

  const addComment = async (text) => {
    const newComment = {
      _id: Date.now().toString(), // temporary ID
      createdBy: "You",
      content: text,
      createdAt: new Date().toISOString(),
      replies: [],
      likes: [],
    };

    // Optimistic update
    const updatedComments = [newComment, ...localComments];
    setLocalComments(updatedComments);

    try {
      await addNewComment(text);
    } catch (error) {
      toast.error("Failed to add comment");
      setLocalComments(localComments); // Revert on error
    }
  };

  const addNestedReply = async (id, text) => {
    const newReply = {
      _id: Date.now().toString(), // temporary ID
      createdBy: "You",
      content: text,
      createdAt: new Date().toISOString(),
      likes: [],
    };

    // Optimistic update
    const updatedComments = localComments.map((comment) => {
      if (comment._id === id) {
        return { ...comment, replies: [newReply, ...comment.replies] };
      }
      return comment;
    });
    setLocalComments(updatedComments);

    try {
      await addNewReply(id, text);
    } catch (error) {
      toast.error("Failed to add reply");
      setLocalComments(localComments); // Revert on error
    }
    setActiveReplyId(null);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleRefresh = () => {
    fetchComments();
  };

  const deleteComment = async (commentId) => {
    // Optimistic update
    const updatedComments = localComments.filter(
      (comment) => comment._id !== commentId
    );
    setLocalComments(updatedComments);

    try {
      await deleteExistingComment(commentId);
    } catch (error) {
      toast.error("Failed to delete comment");
      setLocalComments(localComments); // Revert on error
    }
  };

  const deleteReply = async (replyId) => {
    // Optimistic update
    const updatedComments = localComments.map((comment) => {
      return {
        ...comment,
        replies: comment.replies.filter((reply) => reply._id !== replyId),
      };
    });
    setLocalComments(updatedComments);

    try {
      await deleteExistingReply(replyId);
    } catch (error) {
      toast.error("Failed to delete reply");
      setLocalComments(localComments); // Revert on error
    }
  };

  const filteredComments = localComments.filter((comment) => {
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
        <CommentsHeader
          handleSearch={handleSearch}
          handleRefresh={handleRefresh}
        />
      </div>
      <div className="h-[70%] overflow-y-scroll no-scrollbar px-6">
        <CommentSection
          comments={filteredComments}
          deleteComment={deleteComment}
          deleteReply={deleteReply}
          addNestedReply={addNestedReply}
          activeReplyId={activeReplyId}
          setActiveReplyId={setActiveReplyId}
          loading={loading}
          error={error}
        />
      </div>
      <div className="flex-none h-[15%]">
        <InputComment addComment={addComment} />
      </div>
    </div>
  );
};

export default DiscussionMessage;
