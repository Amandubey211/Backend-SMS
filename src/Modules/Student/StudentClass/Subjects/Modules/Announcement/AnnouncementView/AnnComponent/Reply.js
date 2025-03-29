import React, { useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteStudentAnnounceReply,
  editStudentAnnounceReply,
  toggleStudentAnnounceLike,
} from "../../../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Announcement/announcement.action";
import { FcLike } from "react-icons/fc";

const Reply = ({ reply }) => {
  const dispatch = useDispatch();
  const { userId } = useSelector((store) => store?.common?.user?.userDetails);

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(reply.content);
  const [likesCount, setLikesCount] = useState(reply.likes?.length);
  const [isLiked, setIsLiked] = useState(
    reply.likes.some((like) => like.userId === userId)
  );

  const isCurrentUser =
    String(userId).trim() === String(reply.creatorID).trim();

  const handleEditReply = () => {
    if (editText.trim() && editText !== reply.content) {
      dispatch(
        editStudentAnnounceReply({ replyId: reply._id, newText: editText })
      );
      setIsEditing(false);
    } else {
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    dispatch(deleteStudentAnnounceReply({ replyId: reply._id }));
  };

  const handleToggleLike = () => {
    dispatch(toggleStudentAnnounceLike({ id: reply._id }));
    setIsLiked((prev) => !prev);
    setLikesCount((prev) => prev + (isLiked ? -1 : 1));
  };

  return (
    <div className="ml-8 mt-2 ps-4 bg-white p-2 rounded-lg border shadow-sm">
      {/* User Profile Section */}
      <div className="flex items-center mb-2">
        <img
          src={reply?.profile}
          alt="avatar"
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <h4 className="text-lg font-semibold">{reply.author}</h4>
          {reply?.role && (
            <span className="mr-2 px-2 text-xs font-medium text-green-800 border-green-500 border rounded-full">
              {reply?.role}
            </span>
          )}
          <span className="text-sm text-gray-500">{reply.time}</span>
        </div>

        {/* Edit & Delete Icons */}
        {isCurrentUser && (
          <div className="ml-auto flex space-x-2">
            <MdOutlineEdit
              className="text-gray-500 text-xl cursor-pointer"
              onClick={() => setIsEditing(true)}
            />
            <RxCross2
              className="text-red-500 text-xl cursor-pointer"
              onClick={handleDelete}
            />
          </div>
        )}
      </div>

      {/* Edit Mode */}
      {isEditing ? (
        <div className="flex flex-col mb-2">
          <textarea
            className="w-full border rounded p-2"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              className="bg-blue-500 text-white px-4 py-1 rounded"
              onClick={handleEditReply}
            >
              Save
            </button>
            <button
              className="bg-red-500 text-white px-4 py-1 rounded"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Reply Content */}
          <p className="text-gray-700 mb-2">{reply?.content}</p>

          {/* Actions: Like */}
          <div className="flex items-center mb-2 pt-2 border-t">
            {/* Like Button */}
            {isLiked ? (
              <FcLike
                className="text-gray-500 cursor-pointer"
                onClick={handleToggleLike}
              />
            ) : (
              <FaRegHeart
                className="text-gray-500 cursor-pointer"
                onClick={handleToggleLike}
              />
            )}
            <span className="ml-1 text-gray-500">{likesCount}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default Reply;
