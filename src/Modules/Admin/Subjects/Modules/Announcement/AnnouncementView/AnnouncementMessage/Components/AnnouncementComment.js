import React, { useState } from "react";
import { FaRegHeart, FaRegComment } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import toast from "react-hot-toast";
import { MdOutlineEdit } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { useSelector } from "react-redux";
import AnnouncementReply from "./AnnouncementReply";
import AnnouncementInputComment from "./AnnouncementInputComment";
import useToggleLikeAnnouncementComment from "../../../../../../../../Hooks/AuthHooks/Staff/Admin/Announcement/Comments/useToggleLikeAnnouncementComment";
import useEditAnnouncementComment from "../../../../../../../../Hooks/AuthHooks/Staff/Admin/Announcement/Comments/useEditAnnouncementComment";

const AnnouncementComment = ({
  comment,
  activeReplyId,
  setActiveReplyId,
  addNestedReply,
  handleDeleteComment,
}) => {
  const [showReplies, setShowReplies] = useState(false);
  const { toggleLikeComment } = useToggleLikeAnnouncementComment();
  const { editComment } = useEditAnnouncementComment();
  const { role } = useSelector((store) => store.Auth);
  const [isLiked, setIsLiked] = useState(
    comment.likes.some((like) => like.userId === role)
  );
  const [likesCount, setLikesCount] = useState(comment.likes.length);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const handleReplyClick = (replyId) => {
    setActiveReplyId(activeReplyId === replyId ? null : replyId);
  };

  const handleLikeComment = async () => {
    const originalIsLiked = isLiked;
    const originalLikesCount = likesCount;

    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);

    try {
      await toggleLikeComment(comment._id);
    } catch (err) {
      setIsLiked(originalIsLiked);
      setLikesCount(originalLikesCount);
      toast.error(err.message);
    }
  };

  const handleEditComment = async () => {
    try {
      const updatedComment = await editComment(comment._id, editedContent);
      setIsEditing(false);
      if (updatedComment) {
        setEditedContent(updatedComment.content); // Update the content in state
        comment.content = updatedComment.content; // Update original comment content
      }
    } catch (error) {
      toast.error("Failed to edit comment");
    }
  };

  // Format the date using built-in JavaScript methods
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "short", day: "numeric" };
    const timeOptions = { hour: "2-digit", minute: "2-digit" };
    return `${date.toLocaleDateString(
      undefined,
      options
    )} at ${date.toLocaleTimeString(undefined, timeOptions)}`;
  };

  const formattedDate = formatDate(comment.createdAt);

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
          <span className="text-sm text-gray-500">{formattedDate}</span>
        </div>
        <div className="ml-auto flex space-x-2">
          <MdOutlineEdit
            className={`text-xl cursor-pointer ${
              isEditing ? "text-blue-500" : "text-gray-500"
            }`}
            onClick={() => setIsEditing((prev) => !prev)} // Toggle edit mode
          />
          <RxCross2
            className="text-red-500 cursor-pointer text-xl"
            onClick={() => handleDeleteComment(comment._id)} // Call handleDeleteComment
          />
        </div>
      </div>
      {isEditing ? (
        <AnnouncementInputComment
          addComment={handleEditComment}
          placeholder="Edit your comment..."
          initialText={editedContent}
          onChange={setEditedContent} // Pass function to update editedContent
        />
      ) : (
        <p className="text-gray-700 mb-2">{comment.content}</p>
      )}
      <div className="flex items-center mb-2 pt-3 border-t">
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
        <FaRegComment
          className="ml-4 text-gray-500 cursor-pointer"
          onClick={() => handleReplyClick(comment._id)}
        />
        <span className="ml-1 text-gray-500">Reply</span>
      </div>
      {showReplies && comment.replies.length > 0 && (
        <div className="ml-10">
          {comment.replies.map((reply) => (
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
      {!showReplies && comment.replies.length > 0 && (
        <div
          className="text-blue-500 cursor-pointer"
          onClick={() => setShowReplies(true)}
        >
          View {comment.replies.length} more replies
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
