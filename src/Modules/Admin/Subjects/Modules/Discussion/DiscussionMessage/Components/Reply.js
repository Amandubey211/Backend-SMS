import React, { useState, useEffect } from "react";
import { FaRegHeart, FaRegComment, FaUserCircle } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import { MdOutlineEdit } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { useDispatch } from "react-redux";
import { toggleLikeMessage } from "../../../../../../../Store/Slices/Admin/Class/Discussion/Comments/commentsThunks";
import InputComment from "./InputComment";

const Reply = ({
  reply,
  commentId,
  deleteReply,
  addNestedReply,
  activeReplyId,
  setActiveReplyId,
}) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(reply.content);

  const [isLiked, setIsLiked] = useState(
    reply.likes.some((like) => like.userId === "currentUserId")
  );
  const [likesCount, setLikesCount] = useState(reply.likes.length);

  const handleDeleteReply = () => {
    deleteReply(reply._id);
  };

  const handleReplyClick = () => {
    setActiveReplyId(activeReplyId === reply._id ? null : reply._id);
  };

  const handleLikeReply = async () => {
    const originalIsLiked = isLiked;
    const originalLikesCount = likesCount;

    // Optimistically update the UI
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);

    try {
      // Dispatch the like/unlike action
      await dispatch(toggleLikeMessage(reply._id));
    } catch (err) {
      // Rollback the UI update if the action fails
      setIsLiked(originalIsLiked);
      setLikesCount(originalLikesCount);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleEditSubmit = (newContent) => {
    setIsEditing(false);
    setEditedContent(newContent);
    // Call Redux action to update the reply
  };

  return (
    <div className="ml-10 mt-2 p-2 px-4 bg-gray-50 rounded-md shadow-sm">
      <div className="flex items-center mb-2">
        {reply?.avatarUrl ? (
          <img
            src={reply.avatarUrl}
            alt="avatar"
            className="w-8 h-8 rounded-full mr-3"
          />
        ) : (
          <FaUserCircle className="w-8 h-8 text-gray-500 mr-3" />
        )}
        <div>
          <h4 className="text-md font-semibold">{reply.createdBy}</h4>
          <span className="text-sm text-gray-500">{reply.time}</span>
        </div>
        <div className="ml-auto flex space-x-2">
          {/* <MdOutlineEdit
            className="text-gray-500 text-lg cursor-pointer"
            onClick={handleEditClick}
          /> */}
          <RxCross2
            className="text-red-500 text-lg cursor-pointer"
            onClick={handleDeleteReply}
          />
        </div>
      </div>
      {!isEditing ? (
        <p className="text-gray-700 mb-2">{editedContent}</p>
      ) : (
        <InputComment
          addComment={handleEditSubmit}
          placeholder="Edit your reply..."
          initialText={editedContent}
        />
      )}
      <div className="flex items-center  pt-3 border-t border-gray-200">
        {isLiked ? (
          <FcLike
            className="text-gray-500 cursor-pointer"
            onClick={handleLikeReply}
          />
        ) : (
          <FaRegHeart
            className="text-gray-500 cursor-pointer"
            onClick={handleLikeReply}
          />
        )}
        <span className="ml-1 text-gray-500">{likesCount}</span>
        {/* <FaRegComment
          className="ml-4 text-gray-500 cursor-pointer"
          onClick={handleReplyClick}
        />
        <span className="ml-1 text-gray-500">Reply</span> */}
      </div>
      {/* {activeReplyId === reply._id && (
        <div className="mt-4">
          <InputComment
            addComment={(text) => addNestedReply(reply._id, text)}
            placeholder="Write a reply..."
          />
        </div>
      )} */}
    </div>
  );
};

export default Reply;
