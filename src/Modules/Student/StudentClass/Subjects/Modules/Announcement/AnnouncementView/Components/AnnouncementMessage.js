import React, { useEffect, useState } from "react";
import CommentsHeader from "./CommentsHeader";
import CommentSection from "./CommentSection";
import InputComment from "./InputComment";
import { useParams } from "react-router-dom";
import { ImSpinner3 } from "react-icons/im";
import { FaExclamationTriangle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { createStudentAnnounceComment, fetchStudentAnnounceComments } from "../../../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Announcement/announcement.action";

const AnnouncementMessage = () => {
  const { _id } = useParams();
  const dispatch = useDispatch();
  const { loadingComments, errorComments, announcement, comments } = useSelector((store) => store?.student?.studentAnnounce)

  //const [comments, setComments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [activeReplyParentId, setActiveReplyParentId] = useState(null);

  useEffect(() => {
    if (announcement && announcement?._id) {
      dispatch(fetchStudentAnnounceComments({ aid: announcement._id }));
    }
  }, [announcement?._id, dispatch]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleRefresh = () => {
    if (announcement?._id) {
      dispatch(fetchStudentAnnounceComments({ aid: announcement._id }))
    }
  };

  const filterCommentsRecursively = (comments, query) => {
    return comments.filter((comment) => {
      const author = comment?.author ? comment.author.toLowerCase() : "";
      const isAuthorMatch = author?.includes(query.toLowerCase());
      const isReplyMatch = comment.replies?.some(
        (reply) => filterCommentsRecursively([reply], query).length > 0
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
              //deleteComment={deleteComment}
              //deleteReply={deleteReply}
              //addNestedReply={addNestedReply}
              activeReplyId={activeReplyId}
              setActiveReplyId={setActiveReplyId}
              activeReplyParentId={activeReplyParentId}
              setActiveReplyParentId={setActiveReplyParentId}
            //toggleLike={toggleLike}
            //editComment={editComment}
            //editReply={editReply}
            //currentUserId={studentId}
            />
          </div>
          <div className="flex-none h-[15%]">
            <InputComment addComment={(comment) => dispatch(createStudentAnnounceComment({ aid: announcement._id, text: comment }))} />
          </div>
        </>
      )}
    </div>
  );
};

export default AnnouncementMessage;
