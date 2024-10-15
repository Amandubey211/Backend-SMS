import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommentSection from "./CommentSection";
import InputComment from "./InputComment";
import {
  fetchComments,
  addComment,
  addReply,
  deleteComment,
  toggleLikeComment,
} from "../../../../../Store/Slices/Admin/Class/Comment/commentsThunks"; // Import thunks

const CommentModule = ({ moduleType, moduleId }) => {
  const dispatch = useDispatch();
  const { comments, loading, error, activeReplyId } = useSelector(
    (state) => state.admin.comments
  );

  useEffect(() => {
    // Fetch comments based on the module type (announcement or discussion)
    dispatch(fetchComments({ moduleType, id: moduleId }));
  }, [dispatch, moduleType, moduleId]);

  const handleAddComment = (text) => {
    dispatch(addComment({ moduleType, id: moduleId, text }));
  };

  const handleAddReply = (commentId, text) => {
    dispatch(addReply({ moduleType, id: moduleId, parentId: commentId, text }));
  };

  const handleDeleteComment = (commentId) => {
    dispatch(deleteComment({ moduleType, commentId }));
  };

  const handleToggleLike = (commentId) => {
    dispatch(toggleLikeComment({ moduleType, commentId }));
  };

  return (
    <div className="comments-module">
      <CommentSection
        comments={comments}
        loading={loading}
        error={error}
        onAddReply={handleAddReply}
        onDeleteComment={handleDeleteComment}
        onToggleLike={handleToggleLike}
        activeReplyId={activeReplyId}
      />
      <InputComment onAddComment={handleAddComment} />
    </div>
  );
};

export default CommentModule;
