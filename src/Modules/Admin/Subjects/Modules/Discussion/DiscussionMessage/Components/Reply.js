import React, { useState, useEffect } from "react";
import { FaRegHeart, FaRegComment } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import toast from "react-hot-toast";
import { MdOutlineEdit } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import InputComment from "./InputComment";
import useToggleLikeMessage from "../../../../../../../Hooks/AuthHooks/Staff/Admin/Disscussion/Message/useToggleLikeMessage";
import useEditReply from "../../../../../../../Hooks/AuthHooks/Staff/Admin/Disscussion/Message/useEditReply";

const Reply = ({
  reply,
  commentId,
  deleteReply,
  addNestedReply,
  activeReplyId,
  setActiveReplyId,
}) => {
  const { toggleLikeMessage } = useToggleLikeMessage();
  const { editReply } = useEditReply();
  const [isLiked, setIsLiked] = useState(
    reply.likes.some((like) => like.userId === reply.createdBy)
  );
  const [likesCount, setLikesCount] = useState(reply.likes.length);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(reply.content);

  const handleDeleteReply = () => {
    deleteReply(commentId, reply._id);
    toast.success("Reply Deleted");
  };

  const handleReplyClick = () => {
    setActiveReplyId(activeReplyId === reply._id ? null : reply._id);
  };

  const handleLikeReply = async () => {
    const originalIsLiked = isLiked;
    const originalLikesCount = likesCount;

    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);

    try {
      await toggleLikeMessage(reply._id);
    } catch (err) {
      setIsLiked(originalIsLiked);
      setLikesCount(originalLikesCount);
      toast.error(err.message);
    }
  };

  const handleEditReply = async (text) => {
    setEditedContent(text);
    setIsEditing(false);
    await editReply(reply._id, text);
    toast.success("Reply Edited");
  };

  useEffect(() => {
    if (isEditing) {
      setEditedContent(reply.content);
    }
  }, [isEditing, reply.content]);

  return (
    <div className="ml-10 mt-2 p-4 bg-gray-100 rounded-md shadow-sm">
      <div className="flex items-center mb-2">
        <img
          src={reply.avatarUrl}
          alt="avatar"
          className="w-8 h-8 rounded-full mr-3"
        />
        <div>
          <h4 className="text-md font-semibold">{reply.author}</h4>
          {reply.role && (
            <span className="mr-2 px-2 text-xs font-medium text-green-800 border border-green-500 rounded-full">
              {reply.role}
            </span>
          )}
          <span className="text-sm text-gray-500">{reply.time}</span>
        </div>
        <div className="ml-auto flex space-x-2">
          <MdOutlineEdit
            className="text-gray-500 text-lg cursor-pointer"
            onClick={() => setIsEditing(true)}
          />
          <RxCross2
            className="text-red-500 text-lg cursor-pointer"
            onClick={handleDeleteReply}
          />
        </div>
      </div>
      {isEditing ? (
        <InputComment
          addComment={handleEditReply}
          placeholder="Edit your reply..."
          initialText={editedContent}
        />
      ) : (
        <>
          <p className="text-gray-700 mb-2">{reply.content}</p>
          <div className="flex items-center mb-2 pt-3 border-t border-gray-200">
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
            <FaRegComment
              className="ml-4 text-gray-500 cursor-pointer"
              onClick={handleReplyClick}
            />
            <span className="ml-1 text-gray-500">Reply</span>
          </div>
          {activeReplyId === reply._id && (
            <div className="mt-4">
              <InputComment
                addComment={(text) => addNestedReply(reply._id, text, true)}
                placeholder="Write a reply..."
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Reply;
