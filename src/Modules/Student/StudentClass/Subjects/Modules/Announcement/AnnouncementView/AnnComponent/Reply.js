import React, { useState } from "react";
import { FaRegHeart, FaRegComment, FaTrashAlt } from "react-icons/fa";
import InputComment from "./InputComment";
import toast from "react-hot-toast";
import { MdOutlineEdit } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";

const Reply = ({
  reply,
  commentId,
  deleteReply,
  addNestedReply,
  activeReplyId,
  setActiveReplyId,
  toggleLike,
  editReply,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(reply.text);

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditText(reply.text);
  };

  const handleEditReply = async () => {
    if (editText.trim() && editText !== reply.text) {
      await editReply(reply.id, editText);
      setIsEditing(false);
    } else {
      setIsEditing(false);
    }
  };
  const handleDelete = () => {
    console.log(
      ` REPLY COMPOMENT==> reply with ID: ${reply.id} from comment with ID: ${commentId}`
    );

    deleteReply(commentId, reply.id);
  };

  const handleReplyClick = () => {
    setActiveReplyId(activeReplyId === reply.id ? null : reply.id);
  };

  const handleAddNestedReply = (text) => {
    if (text.trim()) {
      addNestedReply(reply.id, text, true);
      setActiveReplyId(null);
    }
  };
  const handleToggleLike = async () => {
    try {
      const updatedReply = await toggleLike(reply.id);
    } catch (error) {
      console.log("Failed to toggle like.", error);
      toast.error("Failed to toggle like.");
    }
  };
  return (
    <div className="ml-8 mt-2 ps-4 bg-gray-100 p-2 rounded-lg border shadow-sm">
      <div className="flex items-center mb-2">
        <img
          src={reply.avatarUrl}
          alt="avatar"
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <h4 className="text-lg font-semibold">{reply.author}</h4>
          {reply.role && (
            <span className="mr-2 px-2 text-xs font-medium text-green-800 border-green-500 border rounded-full">
              {reply.role}
            </span>
          )}
          <span className="text-sm text-gray-500">{reply.time}</span>
        </div>
        <div className="ml-auto gap-2 flex space-x-2">
          <MdOutlineEdit
            className="text-gray-500 text-xl cursor-pointer"
            onClick={() => setIsEditing(true)}
          />
          <RxCross2
            className="text-red-500 text-xl cursor-pointer"
            onClick={handleDelete}
          />
        </div>
      </div>

      {isEditing ? (
        <div className="flex flex-col mb-2">
          <textarea
            className="w-full border rounded p-2"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              className="mt-2 self-end bg-blue-500 text-white px-4 py-1 rounded"
              onClick={handleEditReply}
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
      ) : (
        <>
          <p className="text-gray-700 mb-2">{reply.text}</p>
          <div className="flex items-center mb-2 pt-2 border-t">
            <FaRegHeart
              className="text-gray-500 cursor-pointer"
              onClick={handleToggleLike}
            />
            <span className="ml-1 text-gray-500">{reply.likes}</span>
            <FaRegComment
              className="ml-4 text-gray-500 cursor-pointer"
              onClick={handleReplyClick}
            />
            <span className="ml-1 text-gray-500">Reply</span>
          </div>
          {activeReplyId === reply.id && (
            <div className="mt-4">
              <InputComment
                addComment={handleAddNestedReply}
                placeholder="Write a reply..."
              />
            </div>
          )}
          <div className="mt-4 ml-4">
            {reply.replies &&
              reply.replies.map((nestedReply) => (
                <Reply
                  key={nestedReply.id}
                  reply={nestedReply}
                  commentId={commentId}
                  deleteReply={deleteReply}
                  addNestedReply={addNestedReply}
                  activeReplyId={activeReplyId}
                  setActiveReplyId={setActiveReplyId}
                  toggleLike={toggleLike}
                  editReply={editReply}
                />
              ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Reply;
