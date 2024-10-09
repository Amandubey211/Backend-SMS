import React from "react";
import Comment from "./Components/Comment";

const CommentSection = ({
  comments,
  deleteComment,
  deleteReply,
  addNestedReply,
  activeReplyId,
  setActiveReplyId,
  activeReplyParentId,
  setActiveReplyParentId,
  //toggleLike,
  editComment, // Pass editComment
  editReply,
  //currentUserId,
}) => {
  return (
    <div className="w-full h-full">
      {comments?.map((comment) => (
        <Comment
          key={comment._id}
          comment={comment}
          deleteReply={deleteReply}
          activeReplyId={activeReplyId}
          addNestedReply={addNestedReply}
          setActiveReplyId={setActiveReplyId}
          activeReplyParentId={activeReplyParentId}
          setActiveReplyParentId={setActiveReplyParentId}
          editReply={editReply}
        />
      ))}
    </div>
  );
};

export default CommentSection;
