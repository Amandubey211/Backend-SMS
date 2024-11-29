import React, { useEffect, useState } from "react";
import CommentSection from "./CommentSection";
import CommentsHeader from "./Components/CommentsHeader";
import InputComment from "./Components/InputComment";
import { useParams } from "react-router-dom";
import { ImSpinner3 } from "react-icons/im";
import { FaExclamationTriangle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { createStudentDiscussionComment, createStudentDiscussionReply, deleteStudentDiscussionComment, deleteStudentDiscussionReply, editStudentDiscussionComment, editStudentDiscussionReply, fetchStudentCommentsByDiscussion, toggleLikeStudentDiscussion } from "../../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Discussion/discussion.action";

const DiscussionMessage = () => {

  const dispatch = useDispatch();
  const { discussion, comments, loadingComments, errorComments } = useSelector((store) => store?.student?.studentDiscussion)
  const { userId } = useSelector((store) => store?.common?.user?.userDetails);
  const studentId = userId

  const { _id } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [activeReplyParentId, setActiveReplyParentId] = useState(null);

  useEffect(() => {
    if (discussion && discussion?._id) {
      dispatch(fetchStudentCommentsByDiscussion({ discussionId: discussion._id }));
    }
  }, [discussion?._id, dispatch]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleRefresh = () => {
    if (discussion?._id) {
      dispatch(fetchStudentCommentsByDiscussion({ discussionId: discussion._id }));
    }
  };

  const filterCommentsRecursively = (comments, query) => {
    return comments?.filter((comment) => {
      const author = comment?.author ? comment?.author.toLowerCase() : "";
      const isAuthorMatch = author?.includes(query.toLowerCase());
      const isReplyMatch = comment?.replies?.some(
        (reply) => filterCommentsRecursively([reply], query)?.length > 0
      );
      return isAuthorMatch || isReplyMatch;
    });
  };


  const filteredComments = filterCommentsRecursively(comments, searchQuery);

  return (
    <div className="h-screen flex flex-col">
      {loadingComments ? (
        <>
          <div className="flex flex-col items-center justify-center py-10 text-gray-500">
            <ImSpinner3 className="w-12 h-12 animate-spin mb-3" />
            <p className="text-lg font-semibold">Loading comments...</p>
          </div>
        </>
      ) : errorComments ? (
        <>
          <div className="flex flex-col items-center justify-center py-10 text-gray-500">
            <FaExclamationTriangle className="w-12 h-12 mb-3" />
            <p className="text-lg font-semibold">{errorComments}</p>
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
              deleteComment={(commentId) => dispatch(deleteStudentDiscussionComment(commentId))}
              deleteReply={(replyId) => dispatch(deleteStudentDiscussionReply(replyId))}
              addNestedReply={(reply) => dispatch(createStudentDiscussionReply({ discussionId: discussion._id, reply }))}
              //deleteReply={deleteReply}
              //addNestedReply={addNestedReply}
              activeReplyId={activeReplyId}
              setActiveReplyId={setActiveReplyId}
              activeReplyParentId={activeReplyParentId}
              setActiveReplyParentId={setActiveReplyParentId}
              editReply={(replyId, updatedReply) => dispatch(editStudentDiscussionReply({ replyId, updatedReply }))}
              //editReply={editReply}
              currentUserId={studentId}
            />
          </div>
          <div className="flex-none h-[15%]">
            <InputComment addComment={(comment) => dispatch(createStudentDiscussionComment({ discussionId: discussion._id, comment }))} />
          </div>
        </>
      )}
    </div>
  );
};

export default DiscussionMessage;
