import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AnnouncementCommentsHeader from "./Components/AnnouncementCommentsHeader";
import AnnouncementComment from "./Components/AnnouncementComment";
import AnnouncementInputComment from "./Components/AnnouncementInputComment";
import { FaRegCommentDots } from "react-icons/fa";
import {
  fetchAnnouncementComments,
  addAnnouncementComment,
  addAnnouncementReply,
  deleteAnnouncementComment,
  toggleLikeAnnouncementComment,
} from "../../../../../../../Store/Slices/Admin/Class/Announcement/Comment/announcementCommentsThunks";
import Spinner from "../../../../../../../Components/Common/Spinner";
import { useParams } from "react-router-dom";

const AnnouncementCommentSection = () => {
  const dispatch = useDispatch();
  const { comments, loading, error } = useSelector(
    (state) => state.admin.announcementComments
  );

  const { aid: announcementId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [localComments, setLocalComments] = useState([]);

  useEffect(() => {
    dispatch(fetchAnnouncementComments(announcementId));
  }, [dispatch, announcementId]);

  useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleRefresh = () => {
    dispatch(fetchAnnouncementComments(announcementId));
  };

  const handleAddComment = async (text) => {
    try {
      await dispatch(addAnnouncementComment({ announcementId, text }));
      dispatch(fetchAnnouncementComments(announcementId)); // Refresh comments after adding
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const addNestedReply = async (parentId, text) => {
    try {
      await dispatch(addAnnouncementReply({ announcementId, parentId, text }));
      dispatch(fetchAnnouncementComments(announcementId));
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await dispatch(deleteAnnouncementComment(commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const filteredComments = localComments.filter((comment) => {
    const searchInComment = comment.createdBy
      ? comment.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
      : false;
    const searchInReplies = comment.replies.some((reply) =>
      reply.createdBy
        ? reply.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
        : false
    );
    return searchInComment || searchInReplies;
  });

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-none h-[10%]">
        <AnnouncementCommentsHeader
          handleSearch={handleSearch}
          handleRefresh={handleRefresh}
        />
      </div>
      <div className="h-[70%] overflow-y-scroll no-scrollbar px-6">
        {loading && <Spinner />}
        {error && <p className="text-red-500">Error: {error}</p>}
        {!loading && !error && filteredComments.length === 0 && (
          <div className="text-center w-full mt-40">
            <FaRegCommentDots size={64} className="mx-auto text-gray-500" />
            <p className="mt-4 text-lg text-gray-500">No comments found</p>
          </div>
        )}
        {filteredComments?.map((comment) => (
          <AnnouncementComment
            key={comment._id}
            comment={comment}
            activeReplyId={activeReplyId}
            setActiveReplyId={setActiveReplyId}
            addNestedReply={addNestedReply}
            handleDeleteComment={handleDeleteComment}
          />
        ))}
      </div>
      <div className="flex-none h-[15%]">
        <AnnouncementInputComment addComment={handleAddComment} />
      </div>
    </div>
  );
};

export default AnnouncementCommentSection;
