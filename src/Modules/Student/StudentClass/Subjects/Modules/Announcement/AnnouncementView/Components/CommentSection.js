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
}) => {
  return (
    <div className="w-full h-full">
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          toggleLike={toggleLike}
          deleteComment={deleteComment}
          deleteReply={deleteReply}
          addNestedReply={addNestedReply}
          activeReplyId={activeReplyId}
          setActiveReplyId={setActiveReplyId}
          activeReplyParentId={activeReplyParentId}
          setActiveReplyParentId={setActiveReplyParentId}
          editComment={editComment} // Pass editComment
          editReply={editReply}
        />
      ))}
    </div>
  );
};

export default CommentSection;
