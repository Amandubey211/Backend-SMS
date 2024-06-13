import React, { useState } from 'react';
import { FaRegHeart, FaRegComment, FaEdit, FaTrashAlt } from 'react-icons/fa';
import Reply from './Reply';
import InputComment from './InputComment';
import toast from 'react-hot-toast';
import { MdOutlineEdit } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
const Comment = ({ comment, deleteComment, deleteReply, addNestedReply, activeReplyId, setActiveReplyId }) => {
  const [showReplies, setShowReplies] = useState(false);

  const handleDeleteComment = () => {
    if (comment.isUserCreated) {
      deleteComment(comment.id);
      toast.success('Comment Deleted');
    } else {
      toast.error('You can only delete comments you created.');
    }
  };

  const handleReplyClick = (replyId) => {
    setActiveReplyId(activeReplyId === replyId ? null : replyId);
  };

  return (
    <div className="bg-white p-2 mb-4">
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
          <MdOutlineEdit className="text-gray-500 text-xl cursor-pointer" />
          <RxCross2 className="text-red-500 cursor-pointer text-xl" onClick={handleDeleteComment} />
        </div>
      </div>
      <p className="text-gray-700 mb-2">{comment.text}</p>
      <div className="flex items-center mb-2 pt-3 border-t">
        <FaRegHeart className="text-gray-500 cursor-pointer" />
        <span className="ml-1 text-gray-500">{comment.likes}</span>
        <FaRegComment className="ml-4 text-gray-500 cursor-pointer" onClick={() => handleReplyClick(comment.id)} />
        <span className="ml-1 text-gray-500">Reply</span>
      </div>
      {showReplies && comment.replies.length > 0 && (
        <div>
          {comment.replies.map((reply) => (
            <Reply
              key={reply.id}
              reply={reply}
              commentId={comment.id}
              deleteReply={deleteReply}
              addNestedReply={addNestedReply}
              activeReplyId={activeReplyId}
              setActiveReplyId={setActiveReplyId}
            />
          ))}
          <div
            className="text-blue-500 cursor-pointer ml-10"
            onClick={() => setShowReplies(false)}
          >
            See less
          </div>
        </div>
      )}
      {!showReplies && comment.replies.length > 0 && (
        <div
          className="text-blue-500 cursor-pointer ml-10"
          onClick={() => setShowReplies(true)}
        >
          View {comment.replies.length} more replies
        </div>
      )}
      {activeReplyId === comment.id && (
        <div className="mt-4">
          <InputComment
            addComment={(text) => addNestedReply(comment.id, text)}
            placeholder="Write a reply..."
          />
        </div>
      )}
    </div>
  );
};

export default Comment;
