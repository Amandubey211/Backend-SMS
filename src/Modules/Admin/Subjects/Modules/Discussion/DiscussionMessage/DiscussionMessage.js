import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommentSection from "./CommentSection";
import CommentsHeader from "./Components/CommentsHeader";
import InputComment from "./Components/InputComment";
import {
  fetchComments,
  addComment,
  addReply,
  deleteComment,
  deleteReply,
} from "../../../../../../Store/Slices/Admin/Class/Discussion/Comments/commentsThunks";
import {
  setActiveReplyId,
  resetActiveReplyId,
} from "../../../../../../Store/Slices/Admin/Class/Discussion/Comments/discussionCommentsSlice";
import { useParams } from "react-router-dom";
import ProtectedAction from "../../../../../../Routes/ProtectedRoutes/ProtectedAction";
import ProtectedSection from "../../../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../../../config/permission";

const DiscussionMessage = () => {
  const dispatch = useDispatch();
  const { comments, loading, error, activeReplyId } = useSelector(
    (state) => state.admin.discussionComments
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [localComments, setLocalComments] = useState(comments);
  const { did: discussionId } = useParams();
  // Fetch comments when component mounts
  useEffect(() => {
    dispatch(fetchComments(discussionId));
  }, [dispatch]);

  // Update local comments whenever Redux comments change
  useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  // Add a new comment
  const handleAddComment = async (text) => {
    dispatch(addComment({ discussionId, text }));
  };

  // Add a reply to a comment
  const handleAddReply = async (id, text) => {
    dispatch(addReply({ discussionId, parentId: id, text }));
  };

  // Delete a comment
  const handleDeleteComment = (commentId) => {
    dispatch(deleteComment(commentId));
  };

  // Delete a reply
  const handleDeleteReply = (replyId) => {
    dispatch(deleteReply(replyId));
  };

  // Handle search query
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Refresh the comments list
  const handleRefresh = () => {
    dispatch(fetchComments(discussionId));
  };

  // Filter comments based on search query
  const filteredComments = localComments?.filter((comment) => {
    const searchInComment = comment?.createdBy
      ? comment?.createdBy?.toLowerCase()?.includes(searchQuery.toLowerCase())
      : false;
    const searchInReplies = comment?.replies?.some((reply) =>
      reply.createdBy
        ? reply?.createdBy?.toLowerCase()?.includes(searchQuery?.toLowerCase())
        : false
    );
    return searchInComment || searchInReplies;
  });

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-none h-[10%]">
        <CommentsHeader
          handleSearch={handleSearch}
          handleRefresh={handleRefresh}
        />
      </div>
      <ProtectedSection
        requiredPermission={PERMISSIONS.CREATE_COMMENT_ON_DISCUSSION}
        title="Discussion Comments"
      >
        <div className="h-[70%] overflow-y-scroll no-scrollbar px-6">
          <CommentSection
            comments={filteredComments}
            deleteComment={handleDeleteComment}
            deleteReply={handleDeleteReply}
            addNestedReply={handleAddReply}
            activeReplyId={activeReplyId}
            setActiveReplyId={(id) => dispatch(setActiveReplyId(id))}
            loading={loading}
            error={error}
          />
        </div>
      </ProtectedSection>
      <ProtectedAction
        requiredPermission={PERMISSIONS.CREATE_COMMENT_ON_DISCUSSION}
      >
        <div className="flex-none h-[15%]">
          <InputComment addComment={handleAddComment} />
        </div>
      </ProtectedAction>
    </div>
  );
};

export default DiscussionMessage;
