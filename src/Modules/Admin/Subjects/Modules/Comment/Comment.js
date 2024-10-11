import React, { useState } from "react";
import { FaRegHeart, FaRegComment } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import { MdOutlineEdit } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import InputComment from "./InputComment";

const Comment = ({
  comment,
  onAddReply,
  onDeleteComment,
  onToggleLike,
  activeReplyId,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [isLiked, setIsLiked] = useState(
    comment.likes.some((like) => like.userId === "currentUserId")
  );
  const [likesCount, setLikesCount] = useState(comment.likes.length);

  const handleReplyClick = () => {
    setIsEditing(!isEditing);
  };

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
    onToggleLike(comment._id);
  };

  const handleDeleteClick = () => {
    onDeleteComment(comment._id);
  };

  return (
    <div className={`comment ${comment.isDeleted ? "comment-deleted" : ""}`}>
      <div className="comment-header flex items-center mb-2">
        {/* Profile Picture */}
        <img
          src={comment.profile}
          alt={`${comment.createdBy}'s profile`}
          className="comment-avatar w-10 h-10 rounded-full mr-3"
        />
        <div className="flex-grow">
          {/* Author and Role */}
          <h4 className="text-md font-semibold">
            {comment.createdBy} ({comment.role})
          </h4>
          {/* Timestamp */}
          <span className="text-sm text-gray-500">
            {new Date(comment.createdAt).toLocaleString()}
          </span>
        </div>
        <div className="comment-actions flex space-x-2">
          <FaRegComment onClick={handleReplyClick} className="cursor-pointer" />
          {isLiked ? (
            <FcLike onClick={handleLikeClick} className="cursor-pointer" />
          ) : (
            <FaRegHeart onClick={handleLikeClick} className="cursor-pointer" />
          )}
          <MdOutlineEdit
            onClick={handleReplyClick}
            className="cursor-pointer text-gray-500"
          />
          <RxCross2
            onClick={handleDeleteClick}
            className="cursor-pointer text-red-500"
          />
        </div>
      </div>
      {/* Display Content */}
      {!isEditing ? (
        <p className="text-gray-700 mb-2">{editedContent}</p>
      ) : (
        <InputComment
          initialText={editedContent}
          onAddComment={(text) => onAddReply(comment._id, text)}
        />
      )}
      {/* Display Attachment if exists */}
      {comment.attachment && (
        <div className="comment-attachment mt-2">
          <a
            href={comment.attachment}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            View Attachment
          </a>
        </div>
      )}
    </div>
  );
};

export default Comment;
