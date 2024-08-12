import React from 'react';
import Comment from '../AnnComponent/Comment';

const CommentSection = ({ comments, deleteComment, deleteReply, addNestedReply, activeReplyId, setActiveReplyId,
  activeReplyParentId,
  setActiveReplyParentId
 }) => {
  return (
    <div className="w-full h-full">
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          deleteComment={deleteComment}
          deleteReply={deleteReply}
          addNestedReply={addNestedReply}
          activeReplyId={activeReplyId}
          setActiveReplyId={setActiveReplyId}
          activeReplyParentId={activeReplyParentId}
          setActiveReplyParentId={setActiveReplyParentId}
        />
      ))}
    </div>
  );
};

export default CommentSection;
