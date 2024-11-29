
import React, { useState } from "react";
import { FaRegHeart, FaRegComment } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import toast from "react-hot-toast";
import InputComment from "./InputComment";
import { useDispatch, useSelector } from "react-redux";
import { createStudentDiscussionReply, deleteStudentDiscussionReply, editStudentDiscussionReply, fetchStudentCommentsByDiscussion, toggleLikeStudentDiscussion } from "../../../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Discussion/discussion.action";
import { FcLike } from "react-icons/fc";

const Reply = ({
  reply,
  commentId,
  //deleteReply,
  //addNestedReply,
  activeReplyId,
  setActiveReplyId,
  //toggleLike,
  editReply,
  // currentUserId,
}) => {
  const { userId } = useSelector((store) => store?.common?.user?.userDetails);
  const currentUserId = userId;
  const { discussion } = useSelector((store) => store?.student?.studentDiscussion)
  const dispatch = useDispatch()

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(reply.text);
  const [likes, setLikes] = useState(reply.likes);

  // Console logs to debug
  const [likesCount, setLikesCount] = useState(reply.likes?.length);
  const [isLiked, setIsLiked] = useState(
    reply.likes.some((like) => like.userId === userId)
  );

  const normalizedCurrentUserId = String(currentUserId).trim().toString();
  const normalizedReplyAuthorId = String(reply.creatorID).trim().toString();

  console.log("reply Result:", reply);
  console.log("activeReplyId", activeReplyId);


  const handleEditReply = () => {
    if (editText.trim() && editText !== reply.content) {
      dispatch(editStudentDiscussionReply({ replyId: reply._id, newText: editText }))
      //await editReply(reply.id, editText);
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
    //deleteReply(commentId, reply.id);
    dispatch(deleteStudentDiscussionReply(reply._id))
    dispatch(fetchStudentCommentsByDiscussion({ discussionId: discussion._id }))
  };

  const handleReplyClick = () => {
    setActiveReplyId(activeReplyId === reply._id ? null : reply._id);
  };

  const handleAddNestedReply = (text) => {
    if (text.trim()) {
      dispatch(createStudentDiscussionReply({ discussionId: discussion._id, replyId: reply._id, text: text }))
      setActiveReplyId(null);
    }
  };

  const handleToggleLike = () => {
    const originalIsLiked = isLiked;
    const originalLikesCount = likesCount;
    dispatch(toggleLikeStudentDiscussion({ id: reply._id })).then(() => {
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    }).catch(() => {
      setIsLiked(originalIsLiked);
      setLikesCount(originalLikesCount);
    })
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "short", day: "numeric" };
    const timeOptions = { hour: "2-digit", minute: "2-digit" };
    return `${date.toLocaleDateString(
      undefined,
      options
    )} at ${date.toLocaleTimeString(undefined, timeOptions)}`;
  };

  const formattedDate = formatDate(reply?.createdAt);

  return (
    <div className="ml-8 mt-2 ps-4 bg-white p-2 rounded-lg border shadow-sm">
      <div className="flex items-center mb-2">
        <img
          src={reply?.profile}
          alt="avatar"
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <h4 className="text-lg font-semibold">{reply?.createdBy}</h4>
          {reply?.role && (
            <span className="mr-2 px-2 text-xs font-medium text-green-800 border-green-500 border rounded-full">
              {reply?.role}
            </span>
          )}
          <span className="text-sm text-gray-500">{formattedDate}</span>
        </div>

        {/* {String(currentUserId).trim() === String(reply.authorId).trim() && ( */}
        {normalizedCurrentUserId === normalizedReplyAuthorId && (
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
        )}
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
          <p className="text-gray-700 mb-2">{reply?.content}</p>
          <div className="flex items-center mb-2 pt-2 border-t">
            {/* <FaRegHeart
              className="text-gray-500 cursor-pointer"
              onClick={handleToggleLike}
            /> */}
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
            <FaRegComment
              className="ml-4 text-gray-500 cursor-pointer"
              onClick={handleReplyClick}
            />
            <span className="ml-1 text-gray-500">Reply</span>
          </div>

          {activeReplyId === reply._id && (
            <div className="mt-4">
              <InputComment
                addComment={handleAddNestedReply}
                placeholder="Write a reply..."
              />
            </div>
          )}

          <div className="mt-4 ml-4">
            {reply.replies &&
              reply.replies?.map((nestedReply) => (
                <Reply
                  key={nestedReply._id}
                  reply={nestedReply}
                  commentId={commentId}
                  //deleteReply={deleteReply}
                  //addNestedReply={addNestedReply}
                  activeReplyId={activeReplyId}
                  setActiveReplyId={setActiveReplyId}
                  //toggleLike={toggleLike}
                  editReply={editReply}
                  currentUserId={currentUserId}
                />
              ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Reply;

