import React, { useState } from "react";
import { FaRegHeart, FaRegComment } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { FcLike } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import {
  createStudentDiscussionReply,
  deleteStudentDiscussionReply,
  editStudentDiscussionReply,
  fetchStudentCommentsByDiscussion,
  toggleLikeStudentDiscussion,
} from "../../../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Discussion/discussion.action";
import InputComment from "./InputComment";

const Reply = ({ reply, commentId, activeReplyId, setActiveReplyId }) => {
  const { userId } = useSelector((store) => store?.common?.user?.userDetails);
  const { discussion } = useSelector(
    (store) => store?.student?.studentDiscussion
  );
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(reply.text);
  const [likesCount, setLikesCount] = useState(reply.likes?.length);
  const [isLiked, setIsLiked] = useState(
    reply.likes.some((like) => like.userId === userId)
  );

  const handleEditReply = () => {
    if (editText.trim() && editText !== reply.content) {
      dispatch(
        editStudentDiscussionReply({ replyId: reply._id, newText: editText })
      );
      setIsEditing(false);
    } else {
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditText(reply.content);
  };

  const handleDelete = () => {
    dispatch(deleteStudentDiscussionReply(reply._id));
    dispatch(
      fetchStudentCommentsByDiscussion({ discussionId: discussion._id })
    );
  };

  const handleReplyClick = () => {
    setActiveReplyId(activeReplyId === reply._id ? null : reply._id);
  };

  const handleAddNestedReply = (text) => {
    if (text.trim()) {
      dispatch(
        createStudentDiscussionReply({
          discussionId: discussion._id,
          replyId: reply._id,
          text,
        })
      );
      setActiveReplyId(null);
    }
  };

  const handleToggleLike = () => {
    const originalIsLiked = isLiked;
    const originalLikesCount = likesCount;
    dispatch(toggleLikeStudentDiscussion({ id: reply._id }))
      .then(() => {
        setIsLiked(!isLiked);
        setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
      })
      .catch(() => {
        setIsLiked(originalIsLiked);
        setLikesCount(originalLikesCount);
      });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })} at ${date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  return (
    <div className="bg-white p-2 mb-2 border rounded-lg shadow-md">
      <div className="flex items-center mb-2">
        <img
          src={reply?.profile}
          alt="avatar"
          className="w-8 h-8 rounded-full mr-3"
        />
        <div>
          <h4 className="text-sm font-semibold">{reply?.createdBy}</h4>
          <span className="text-xs text-gray-500">
            {formatDate(reply?.createdAt)}
          </span>
        </div>
        {userId === reply.creatorID && (
          <div className="ml-auto flex space-x-2">
            <MdOutlineEdit
              className="text-gray-500 cursor-pointer"
              onClick={() => setIsEditing(true)}
            />
            <RxCross2
              className="text-red-500 cursor-pointer"
              onClick={handleDelete}
            />
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="flex flex-col">
          <textarea
            className="w-full border rounded p-2"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded"
              onClick={handleEditReply}
            >
              Save
            </button>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-gray-700 mb-2">{reply?.content}</p>
          <div className="flex items-center text-gray-500">
            {isLiked ? (
              <FcLike className="cursor-pointer" onClick={handleToggleLike} />
            ) : (
              <FaRegHeart
                className="cursor-pointer"
                onClick={handleToggleLike}
              />
            )}
            <span className="ml-1">{likesCount}</span>
            <FaRegComment
              className="ml-4 cursor-pointer"
              onClick={handleReplyClick}
            />
            <span className="ml-1 cursor-pointer">Reply</span>
          </div>
        </>
      )}

      {activeReplyId === reply._id && (
        <div className="mt-2">
          <InputComment
            addComment={handleAddNestedReply}
            placeholder="Write a reply..."
          />
        </div>
      )}
    </div>
  );
};

export default Reply;
