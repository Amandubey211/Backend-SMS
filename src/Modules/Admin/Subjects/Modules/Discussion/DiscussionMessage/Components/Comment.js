import React, { useState } from "react";
import { FaRegHeart, FaRegComment } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import toast from "react-hot-toast";
import { MdOutlineEdit } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { useSelector } from "react-redux";
import useToggleLikeMessage from "../../../../../../../Hooks/AuthHooks/Staff/Admin/Disscussion/Message/useToggleLikeMessage";
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
  const [showReplies, setShowReplies] = useState(false);
  const { toggleLikeMessage } = useToggleLikeMessage();
  const { role } = useSelector((store) => store.Auth);
  const [isLiked, setIsLiked] = useState(comment.likes.some((like) => like.userId === role)); // Check if liked by current user
  const [likesCount, setLikesCount] = useState(comment.likes.length);

  const handleDeleteComment = async () => {
    try {
      await deleteComment(comment._id);
      toast.success("Comment Deleted");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleReplyClick = (replyId) => {
    setActiveReplyId(activeReplyId === replyId ? null : replyId);
  };

  const handleLikeComment = async () => {
    const originalIsLiked = isLiked;
    const originalLikesCount = likesCount;

    // Optimistically update the like state and count
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);

    try {
      await toggleLikeMessage(comment._id);
    } catch (err) {
      // Rollback state if the server call fails
      setIsLiked(originalIsLiked);
      setLikesCount(originalLikesCount);
      toast.error(err.message);
    }
  };

  return (
    <div className="bg-white p-4 mb-4 rounded-md shadow-sm">
      <div className="flex items-center mb-2">
        <img
          src="https://avatars.githubusercontent.com/u/109097090?v=4"
          alt="avatar"
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <h4 className="text-lg font-semibold">{comment.createdBy}</h4>
          {comment.role && (
            <span className="mr-2 px-2 text-xs font-medium text-green-800 border-green-500 border rounded-full">
              {comment.role}
            </span>
          )}
          <span className="text-sm text-gray-500">{comment.time}</span>
        </div>
        <div className="ml-auto flex space-x-2">
          <MdOutlineEdit className="text-gray-500 text-xl cursor-pointer" />
          <RxCross2
            className="text-red-500 cursor-pointer text-xl"
            onClick={handleDeleteComment}
          />
        </div>
      </div>
      <p className="text-gray-700 mb-2">{comment.content}</p>
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
        <FaRegComment
          className="ml-4 text-gray-500 cursor-pointer"
          onClick={() => handleReplyClick(comment._id)}
        />
        <span className="ml-1 text-gray-500">Reply</span>
      </div>
      {showReplies && comment.replies.length > 0 && (
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
      {!showReplies && comment.replies.length > 0 && (
        <div
          className="text-blue-500 cursor-pointer"
          onClick={() => setShowReplies(true)}
        >
          View {comment.replies.length} more replies
        </div>
      )}
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
