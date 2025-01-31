import React, { useState } from "react";
import { FaRegHeart, FaRegComment } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import { MdOutlineEdit } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import AnnouncementInputComment from "./AnnouncementInputComment";
import AnnouncementReply from "./AnnouncementReply";
import {
  toggleLikeAnnouncementComment,
  deleteAnnouncementComment,
} from "../../../../../../../../Store/Slices/Admin/Class/Announcement/Comment/announcementCommentsThunks";
import ProtectedAction from "../../../../../../../../Routes/ProtectedRoutes/ProtectedAction";
import { PERMISSIONS } from "../../../../../../../../config/permission";

const AnnouncementComment = ({
  comment,
  activeReplyId,
  setActiveReplyId,
  addNestedReply,
}) => {
  const dispatch = useDispatch();
  const { role } = useSelector((state) => state.common.auth);
  const [isLiked, setIsLiked] = useState(
    comment.likes.some((like) => like.userId === role)
  );
  const [likesCount, setLikesCount] = useState(comment.likes?.length);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [showReplies, setShowReplies] = useState(false);

  const handleLikeComment = async () => {
    const originalIsLiked = isLiked;
    const originalLikesCount = likesCount;

    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);

    try {
      await dispatch(toggleLikeAnnouncementComment(comment._id));
    } catch (error) {
      setIsLiked(originalIsLiked);
      setLikesCount(originalLikesCount);
      toast.error(error.message);
    }
  };

  const handleDeleteComment = async () => {
    try {
      await dispatch(deleteAnnouncementComment(comment._id));
    } catch (error) {
      toast.error("Failed to delete comment");
    }
  };

  const handleReplyClick = (replyId) => {
    setActiveReplyId(activeReplyId === replyId ? null : replyId);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="bg-white p-4 mb-4 rounded-md shadow-sm">
      <div className="flex items-center mb-2">
        <img
          src={comment.profile}
          alt="avatar"
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <h4 className="text-lg font-semibold">{comment.createdBy}</h4>
          {comment.role && (
            <span className="mr-2 px-2 text-sm capitalize font-medium text-green-800 border-green-500 border rounded-full">
              {comment.role}
            </span>
          )}
          <span className="text-sm text-gray-500">
            {formatDate(comment.createdAt)}
          </span>
        </div>
        <div className="ml-auto flex space-x-2">
          {/* <MdOutlineEdit
            className={`text-xl cursor-pointer ${
              isEditing ? "text-blue-500" : "text-gray-500"
            }`}
            onClick={() => setIsEditing((prev) => !prev)} // Toggle edit mode
          /> */}
          <ProtectedAction
            requiredPermission={PERMISSIONS.EDIT_COMMENT_ON_ANNOUNCEMENT}
          >
            <RxCross2
              className="text-red-500 cursor-pointer text-xl"
              onClick={handleDeleteComment} // Delete comment
            />
          </ProtectedAction>
        </div>
      </div>
      {isEditing ? (
        <AnnouncementInputComment
          addComment={() => {}}
          placeholder="Edit your comment..."
          initialText={editedContent}
          onChange={setEditedContent}
        />
      ) : (
        <p className="text-gray-700 mb-2">{comment.content}</p>
      )}
      <div className="flex items-center mb-2 pt-3 border-t">
        <ProtectedAction
          requiredPermission={PERMISSIONS.LIKE_COMMENT_ON_ANNOUNCEMENT}
        >
          {isLiked ? (
            <FcLike
              className="text-gray-500 cursor-pointer"
              onClick={handleLikeComment}
            />
          ) : (
            <FaRegHeart
              className="text-gray-500 cursor-pointer"
              onClick={handleLikeComment}
            />
          )}
          <span className="ml-1 text-gray-500">{likesCount}</span>
        </ProtectedAction>

        <ProtectedAction
          requiredPermission={PERMISSIONS.CREATE_COMMENT_ON_ANNOUNCEMENT}
        >
          <FaRegComment
            className="ml-4 text-gray-500 cursor-pointer"
            onClick={() => handleReplyClick(comment._id)}
          />
          <span className="ml-1 text-gray-500">Reply</span>
        </ProtectedAction>
      </div>

      {/* Replies Section */}
      {showReplies && comment.replies?.length > 0 && (
        <div className="">
          {comment?.replies?.map((reply) => (
            <AnnouncementReply
              key={reply._id}
              reply={reply}
              commentId={comment._id}
              activeReplyId={activeReplyId}
              setActiveReplyId={setActiveReplyId}
            />
          ))}
          <div
            className="text-blue-500 cursor-pointer"
            onClick={() => setShowReplies(false)}
          >
            See less
          </div>
        </div>
      )}
      {!showReplies && comment.replies?.length > 0 && (
        <div
          className="text-blue-500 cursor-pointer"
          onClick={() => setShowReplies(true)}
        >
          View {comment.replies?.length} more replies
        </div>
      )}

      {activeReplyId === comment._id && (
        <div className="mt-4">
          <AnnouncementInputComment
            addComment={(text) => addNestedReply(comment._id, text)}
            placeholder="Write a reply..."
          />
        </div>
      )}
    </div>
  );
};

export default AnnouncementComment;
