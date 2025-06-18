import React, { useState } from "react";
import { FaRegHeart, FaRegComment } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import { MdOutlineEdit } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { toggleLikeMessage } from "../../../../../../../Store/Slices/Admin/Class/Discussion/Comments/commentsThunks";
import Reply from "./Reply";
import InputComment from "./InputComment";

const Comment = ({
  comment,
  deleteComment,
  deleteReply,
  addNestedReply,
  activeReplyId,
  setActiveReplyId,
}) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const { role } = useSelector((store) => store.common.auth);
  const [showReplies, setShowReplies] = useState(false);

  // ───── Like state (optimistic UI) ─────
  const [isLiked, setIsLiked] = useState(
    comment.likes.some((like) => like.userId === "currentUserId")
  );
  const [likesCount, setLikesCount] = useState(comment.likes?.length);

  /* ─────────────────────────────────────
   * Helpers
   * ──────────────────────────────────── */
  const isAdmin = role?.toLowerCase() === "admin"; // NEW

  const handleDeleteComment = async () => {
    await deleteComment(comment._id);
  };

  const handleReplyClick = (replyId) => {
    setActiveReplyId(activeReplyId === replyId ? null : replyId);
  };

  const handleLikeComment = async () => {
    const originalIsLiked = isLiked;
    const originalLikesCount = likesCount;

    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);

    try {
      await dispatch(toggleLikeMessage(comment._id));
    } catch (err) {
      setIsLiked(originalIsLiked);
      setLikesCount(originalLikesCount);
    }
  };

  const handleEditSubmit = (newContent) => {
    setIsEditing(false);
    setEditedContent(newContent);
    // dispatch update comment action here if needed
  };

  /* ─────────────────────────────────────
   * Render
   * ──────────────────────────────────── */
  return (
    <div className="bg-white p-4 mb-4 rounded-md shadow-sm">
      {/* Avatar + Meta */}
      <div className="flex items-center mb-2">
        <img
          src={comment.profile || ""}
          alt="avatar"
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <h4 className="text-lg font-semibold">{comment.createdBy}</h4>
          <span className="text-sm text-gray-500">{comment.time}</span>
        </div>

        {/* Action icons (right) */}
        <div className="ml-auto flex space-x-2">
          {/* Uncomment if edit button is needed */}
          {/* <MdOutlineEdit
            className="text-gray-500 text-xl cursor-pointer"
            onClick={() => setIsEditing(true)}
          /> */}

          {/* ▼ DELETE ICON — ADMIN ONLY */}
          {isAdmin && (
            <RxCross2
              className="text-red-500 cursor-pointer text-xl"
              onClick={handleDeleteComment}
            />
          )}
        </div>
      </div>

      {/* Content / Edit box */}
      {!isEditing ? (
        <p className="text-gray-700 mb-2">{editedContent}</p>
      ) : (
        <div className="mt-4">
          <InputComment
            addComment={handleEditSubmit}
            placeholder="Edit your comment..."
            initialText={editedContent}
          />
        </div>
      )}

      {/* Like / Reply row */}
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

        <div
          className="flex items-center gap-0.5 cursor-pointer hover:text-gray-900"
          onClick={() => handleReplyClick(comment._id)}
        >
          <FaRegComment className="ml-4 text-gray-500" />
          <span className="ml-1 text-gray-500">Reply</span>
        </div>
      </div>

      {/* Replies */}
      {showReplies && comment.replies?.length > 0 && (
        <div className="ml-10">
          {comment.replies.map((reply) => (
            <Reply
              key={reply._id}
              reply={reply}
              commentId={comment._id}
              deleteReply={deleteReply}
              addNestedReply={addNestedReply}
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
          View {comment.replies.length} more replies
        </div>
      )}

      {/* Reply input box */}
      {activeReplyId === comment._id && (
        <div className="mt-4">
          <InputComment
            addComment={(text) => addNestedReply(comment._id, text)}
            placeholder="Write a reply..."
          />
        </div>
      )}
    </div>
  );
};

export default Comment;
