import React from 'react';
import Comment from './Components/Comment';

const CommentSection = ({ comments, deleteComment, deleteReply, addNestedReply, activeReplyId, setActiveReplyId }) => {
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
        />
      ))}
    </div>
  );
};

export default CommentSection;
