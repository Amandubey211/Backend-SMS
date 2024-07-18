import React from 'react';
import { FaRegCommentDots } from 'react-icons/fa';
import Comment from "./Components/Comment";
import Spinner from '../../../../../../Components/Common/Spinner';

const CommentSection = ({ comments, deleteComment, deleteReply, addNestedReply, activeReplyId, setActiveReplyId, loading, error }) => {
  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div className="flex justify-center items-center h-full text-red-500">Error: {error}</div>;
  }

  return (
    <div className="w-full h-full flex flex-col">
      {comments.length > 0 ? (
        comments.reverse().map((comment) => (
          <Comment
            key={comment._id}
            comment={comment}
            deleteComment={deleteComment}
            deleteReply={deleteReply}
            addNestedReply={addNestedReply}
            activeReplyId={activeReplyId}
            setActiveReplyId={setActiveReplyId}
          />
        ))
      ) : (
        <div className="text-center w-full mt-40">
          <FaRegCommentDots size={64} className="mx-auto text-gray-500" />
          <p className="mt-4 text-lg text-gray-500">No comments found</p>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
