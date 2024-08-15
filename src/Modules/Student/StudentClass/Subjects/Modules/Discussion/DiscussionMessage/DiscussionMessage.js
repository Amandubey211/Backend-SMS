import React, { useState } from "react";
import CommentSection from "./CommentSection";
import CommentsHeader from "./Components/CommentsHeader";
import InputComment from "./Components/InputComment";
import { useParams } from "react-router-dom";
import { ImSpinner3 } from "react-icons/im";
import { FaExclamationTriangle } from "react-icons/fa";

import { useFetchCommentsByDiscussion } from "../../../../../../../Hooks/AuthHooks/Student/Discussion/Message/useFetchCommentsByDiscussion";
import { useAddComment } from "../../../../../../../Hooks/AuthHooks/Student/Discussion/Message/useAddComment";
import { useAddReply } from "../../../../../../../Hooks/AuthHooks/Student/Discussion/Message/useAddReply";
import { useDeleteComment } from "../../../../../../../Hooks/AuthHooks/Student/Discussion/Message/useDeleteComment";
import { useDeleteReply } from "../../../../../../../Hooks/AuthHooks/Student/Discussion/Message/useDeleteReply";
import { useEditComment } from "../../../../../../../Hooks/AuthHooks/Student/Discussion/Message/useEditComment";
import { useEditReply } from "../../../../../../../Hooks/AuthHooks/Student/Discussion/Message/useEditReply";
import { useToggleLikeMessage } from "../../../../../../../Hooks/AuthHooks/Student/Discussion/Message/useToggleLikeMessage";

const DiscussionMessage = ({ discussion }) => {
  const { _id } = useParams();
  const [comments, setComments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [activeReplyParentId, setActiveReplyParentId] = useState(null);

  const { loading, error, studentId, fetchComments } =
    useFetchCommentsByDiscussion(discussion._id, setComments);
  const { addComment } = useAddComment(discussion._id, comments, setComments);
  const { addNestedReply } = useAddReply(
    discussion._id,
    comments,
    setComments,
    setActiveReplyId,
    setActiveReplyParentId
  );
  const { deleteComment } = useDeleteComment(comments, setComments);
  const { deleteReply } = useDeleteReply(comments, setComments);
  const { editComment } = useEditComment(comments, setComments);
  const { editReply } = useEditReply(comments, setComments);
  const { toggleLike } = useToggleLikeMessage(comments, setComments);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleRefresh = () => {
    fetchComments();
  };

  const filterCommentsRecursively = (comments, query) => {
    return comments.filter((comment) => {
      const author = comment.author ? comment.author.toLowerCase() : "";
      const isAuthorMatch = author.includes(query.toLowerCase());
      const isReplyMatch = comment.replies?.some(
        (reply) => filterCommentsRecursively([reply], query).length > 0
      );
      return isAuthorMatch || isReplyMatch;
    });
  };

  const filteredComments = filterCommentsRecursively(comments, searchQuery);

  return (
    <div className="h-screen flex flex-col">
      {loading ? (
        <>
          <div className="flex flex-col items-center justify-center py-10 text-gray-500">
            <ImSpinner3 className="w-12 h-12 animate-spin mb-3" />
            <p className="text-lg font-semibold">Loading comments...</p>
          </div>
        </>
      ) : error ? (
        <>
          <div className="flex flex-col items-center justify-center py-10 text-gray-500">
            <FaExclamationTriangle className="w-12 h-12 mb-3" />
            <p className="text-lg font-semibold">{error}</p>
          </div>
        </>
      ) : (
        <>
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
              activeReplyParentId={activeReplyParentId}
              setActiveReplyParentId={setActiveReplyParentId}
              toggleLike={toggleLike}
              editComment={editComment}
              editReply={editReply}
              currentUserId={studentId}
            />
          </div>
          <div className="flex-none h-[15%]">
            <InputComment addComment={addComment} />
          </div>
        </>
      )}
    </div>
  );
};

export default DiscussionMessage;
