import React from "react";
import Comment from "./Comment";
import Spinner from "../../../../../Components/Common/Spinner";

const CommentSection = ({
  comments,
  loading,
  error,
  onAddReply,
  onDeleteComment,
  onToggleLike,
  activeReplyId,
}) => {
  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="comment-section">
      {comments.length > 0 ? (
        comments.map((comment) => (
          <Comment
            key={comment._id}
            comment={comment}
            onAddReply={onAddReply}
            onDeleteComment={onDeleteComment}
            onToggleLike={onToggleLike}
            activeReplyId={activeReplyId}
          />
        ))
      ) : (
        <div className="text-center">No comments found</div>
      )}
    </div>
  );
};

export default CommentSection;
