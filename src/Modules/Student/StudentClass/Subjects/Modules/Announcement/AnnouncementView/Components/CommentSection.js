import React from "react";
import Comment from "../AnnComponent/Comment";

const CommentSection = ({
  comments,
  deleteComment,
  deleteReply,
  addNestedReply,
  activeReplyId,
  setActiveReplyId,
  activeReplyParentId,
  setActiveReplyParentId,
  toggleLike,
  editComment, // Pass editComment
  editReply,
  currentUserId,
}) => {
  return (
    <div className="w-full h-full">
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          toggleLike={toggleLike}
          deleteReply={deleteReply}
          activeReplyId={activeReplyId}
          deleteComment={deleteComment}
          addNestedReply={addNestedReply}
          setActiveReplyId={setActiveReplyId}
          activeReplyParentId={activeReplyParentId}
          setActiveReplyParentId={setActiveReplyParentId}
          editComment={editComment} // Pass editComment
          editReply={editReply}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
};

export default CommentSection;
