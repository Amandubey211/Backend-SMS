import React, { useEffect, useRef } from "react";
import Spinner from "../../../../../../Components/Common/Spinner";
import Comment from "./Components/Comment";

const CommentSection = ({
  comments,
  deleteComment,
  deleteReply,
  addNestedReply,
  activeReplyId,
  setActiveReplyId,
  loading,
  error,
}) => {
  const commentsEndRef = useRef(null);

  useEffect(() => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {comments.length > 0 ? (
        comments.map((comment) => (
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
          <p>No comments found</p>
        </div>
      )}
      <div ref={commentsEndRef} />
    </div>
  );
};

export default CommentSection;
