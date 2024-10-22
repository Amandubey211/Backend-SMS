import React, { useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import { MdOutlineEdit } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import AnnouncementInputComment from "./AnnouncementInputComment";
import { toggleLikeAnnouncementComment } from "../../../../../../../../Store/Slices/Admin/Class/Announcement/Comment/announcementCommentsThunks";

const AnnouncementReply = ({
  reply,
  commentId,
  activeReplyId,
  setActiveReplyId,
}) => {
  const dispatch = useDispatch();
  const [isLiked, setIsLiked] = useState(
    reply.likes.some((like) => like.userId === reply.createdBy)
  );
  const [likesCount, setLikesCount] = useState(reply.likes.length);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(reply.content);

  const handleLikeReply = async () => {
    const originalIsLiked = isLiked;
    const originalLikesCount = likesCount;

    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);

    try {
      await dispatch(toggleLikeAnnouncementComment(reply._id));
    } catch (error) {
      setIsLiked(originalIsLiked);
      setLikesCount(originalLikesCount);
      toast.error(error.message);
    }
  };

  return (
    <div className="ml-10 mt-2 p-4 bg-gray-100 rounded-md shadow-sm">
      <div className="flex items-center mb-2">
        <img
          src={reply.profile}
          alt="avatar"
          className="w-8 h-8 rounded-full mr-3"
        />
        <div>
          <h4 className="text-md font-semibold">{reply.createdBy}</h4>
          <span className="text-sm text-gray-500">
            {new Date(reply.createdAt).toLocaleString()}
          </span>
        </div>
        <div className="ml-auto flex space-x-2">
          <MdOutlineEdit
            className="text-gray-500 text-lg cursor-pointer"
            onClick={() => setIsEditing(true)}
          />
          <RxCross2
            className="text-red-500 text-lg cursor-pointer"
            onClick={() => {}}
          />
        </div>
      </div>
      {isEditing ? (
        <AnnouncementInputComment
          addComment={() => {}}
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
          </div>
        </>
      )}
    </div>
  );
};

export default AnnouncementReply;
