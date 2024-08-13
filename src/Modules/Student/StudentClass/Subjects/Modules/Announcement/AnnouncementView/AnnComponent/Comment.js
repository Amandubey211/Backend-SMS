
import React, { useState } from "react";
import { FaRegHeart, FaRegComment, FaTrashAlt } from "react-icons/fa";
import Reply from "./Reply";
import InputComment from "./InputComment";
import toast from "react-hot-toast";
import { MdOutlineEdit } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";

const Comment = ({
  comment,
  deleteComment,
  deleteReply,
  addNestedReply,
  activeReplyId,
  setActiveReplyId,
  activeReplyParentId,
  setActiveReplyParentId,
  toggleLike,
  editComment,
  editReply,
}) => {
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [likes, setLikes] = useState(comment.likes);
  const commentID = comment.id;
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text); 

  

  const handleEditComment = async () => {
    if (editText.trim() && editText !== comment.text) {
      await editComment(comment.id, editText);
      setIsEditing(false);
    } else {
      setIsEditing(false);
    }
  };
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditText(comment.text); 
  };
  const handleDeleteComment = () => {
    deleteComment(comment.id);
  };
  const handleDeleteReply = (commentID, replyId) => {
    console.log(
      `COMMENT COMONEN:==>reply with ID:  ${replyId} from comment with ID: ${commentID}`
    );

    deleteReply(commentID, replyId);
  };

  const handleReplyClick = () => {
    setShowReplyForm(!showReplyForm);
    setActiveReplyParentId(comment.id);
  };

  const handleAddReply = (text) => {
    if (text.trim()) {
      addNestedReply(comment.id, text);
      setShowReplyForm(false);
    }
  };
  const handleToggleLike = async () => {
    try {
      const updatedComment = await toggleLike(comment.id);
      setLikes(updatedComment.likes);
    } catch (error) {
      toast.error("Failed to toggle like.");
    }
  };
  return (
    <div className="bg-white p-2 mb-4 border rounded-lg shadow-md">
      <div className="flex items-center mb-2">
        <img
          src={comment.avatarUrl}
          alt="avatar"
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <h4 className="text-lg font-semibold">{comment.author}</h4>
          {comment.role && (
            <span className="mr-2 px-2 text-xs font-medium text-green-800 border-green-500 border rounded-full">
              {comment.role}
            </span>
          )}
          <span className="text-sm text-gray-500">{comment.time}</span>
        </div>
        <div className="ml-auto flex space-x-2">
          <MdOutlineEdit
            className="text-gray-500 text-xl cursor-pointer"
            onClick={() => setIsEditing(true)}
          />
          <RxCross2
            className="text-red-500 text-xl cursor-pointer"
            onClick={handleDeleteComment}
          />
        </div>
      </div>
      {isEditing ? (
        <>
          <div className="flex flex-col mb-2">
            <textarea
              className="w-full border rounded p-2"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />
          <div className="flex justify-end gap-2 mt-2">
          <button
            className="mt-2 self-end bg-blue-500 text-white px-4 py-1 rounded"
            onClick={handleEditComment}
          >
            Save
          </button>

          <button
              className="mt-2 self-end bg-red-500 text-white px-4 py-1 rounded"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>

          </div>
          </div>
        </>
      ) : (
        <>
          <p className="text-gray-700 mb-2">{comment.text}</p>
          <div className="flex items-center mb-2 pt-3 border-t">
            <FaRegHeart
              className="text-gray-500 cursor-pointer"
              onClick={handleToggleLike}
            />
            <span className="ml-1 text-gray-500">{comment.likes}</span>
            <FaRegComment
              className="ml-4 text-gray-500 cursor-pointer"
              onClick={handleReplyClick}
            />
            <span className="ml-1 text-gray-500">Reply</span>
          </div>
          {showReplyForm && (
            <div className="mt-2">
              <InputComment
                addComment={handleAddReply}
                placeholder="Write a reply..."
              />
            </div>
          )}
          <div className="mt-4">
            {showReplies ? (
              <>
                {comment.replies.map((reply) => (
                  <Reply
                    key={reply.id}
                    reply={reply}
                    commentId={comment.id}
                    deleteReply={handleDeleteReply}
                    addNestedReply={addNestedReply}
                    activeReplyId={activeReplyId}
                    setActiveReplyId={setActiveReplyId}
                    toggleLike={toggleLike}
                    editReply={editReply}
                  />
                ))}
                <div
                  className="text-blue-500 cursor-pointer mt-2"
                  onClick={() => setShowReplies(false)}
                >
                  See less
                </div>
              </>
            ) : (
              comment.replies.length > 0 && (
                <div
                  className="text-blue-500 cursor-pointer mt-2"
                  onClick={() => setShowReplies(true)}
                >
                  View {comment.replies.length} more replies
                </div>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Comment;
