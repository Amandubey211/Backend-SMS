import React from 'react';
import { FaRegHeart, FaRegComment } from 'react-icons/fa';
import InputComment from './InputComment';
import toast from 'react-hot-toast';
import { MdOutlineEdit } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
const Reply = ({ reply, commentId, deleteReply, addNestedReply, activeReplyId, setActiveReplyId }) => {
  const handleDeleteReply = () => {
    if (reply.isUserCreated) {
      deleteReply(commentId, reply.id);
      toast.success('Reply Deleted');
    } else {
      toast.error('You can only delete replies you created.');
    }
  };

  const handleReplyClick = () => {
    setActiveReplyId(activeReplyId === reply.id ? null : reply.id);
  };

  return (
    <div className="ml-8 mt-2 ps-4 bg-gray-100 p-2 rounded-lg">
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
        <MdOutlineEdit className="text-gray-500 text-xl cursor-pointer" />
          <RxCross2 className="text-red-500 text-xl cursor-pointer" onClick={handleDeleteReply} />
        </div>
      </div>
      <p className="text-gray-700 mb-2">{reply.text}</p>
      <div className="flex items-center mb-2 pt-2 border-t">
        <FaRegHeart className="text-gray-500 cursor-pointer" />
        <span className="ml-1 text-gray-500">{reply.likes}</span>
        <FaRegComment className="ml-4 text-gray-500 cursor-pointer" onClick={handleReplyClick} />
        <span className="ml-1 text-gray-500">Reply</span>
      </div>
      {activeReplyId === reply.id && (
        <div className="mt-4">
          <InputComment
            addComment={(text) => addNestedReply(reply.id, text, true)}
            placeholder="Write a reply..."
          />
        </div>
      )}
    </div>
  );
};

export default Reply
