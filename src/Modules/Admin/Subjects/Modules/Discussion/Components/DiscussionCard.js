import React, { useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import { IoCalendarOutline } from "react-icons/io5";
import { TbBookmark, TbBookmarkOff } from "react-icons/tb";
import { BsPatchCheckFill } from "react-icons/bs";
import { GoDiscussionClosed } from "react-icons/go";
import { NavLink, useParams } from "react-router-dom";
import useUpdatePinStatus from "../../../../../../Hooks/AuthHooks/Staff/Admin/Disscussion/useUpdatePinStatus";

const DiscussionCard = ({ discussion }) => {
  const { sid, cid } = useParams();
  const lastReply = discussion.replies.length > 0 ? discussion.replies[discussion.replies.length - 1] : null;
  const { updatePinStatus, loading } = useUpdatePinStatus();
  const [isPinned, setIsPinned] = useState(discussion.isPinned);

  const handlePinClick = async () => {
    const updatedDiscussion = await updatePinStatus(discussion._id, !isPinned);
    if (updatedDiscussion) {
      setIsPinned(updatedDiscussion.isPinned);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg border">
      <div className="flex items-center justify-end space-x-2 mb-4">
        <button onClick={handlePinClick} disabled={loading}>
          {isPinned ? (
            <TbBookmark className="text-green-600 w-6 h-6" />
          ) : (
            <TbBookmarkOff className="text-gray-400 w-6 h-6" />
          )}
        </button>
        <BsPatchCheckFill className="text-green-600 w-6 h-6" />
        <FaEllipsisV className="border w-7 h-7 p-1 rounded-full" />
      </div>
      <NavLink to={`/class/${cid}/${sid}/discussions/${discussion._id}/view`}>
        <div className="flex items-center justify-center mb-4">
          <GoDiscussionClosed className="w-16 h-16 p-2 border rounded-full text-green-500" />
        </div>
        <div className="text-lg flex justify-center capitalize border-b pb-2">
          <span>{discussion.title}</span>
        </div>
      </NavLink>
      <div className="mt-4 text-sm text-gray-600">
        <div className="flex justify-center items-center mb-7 space-x-2">
          <IoCalendarOutline className="w-4 h-4" />
          <span>Last Post at: {lastReply ? new Date(lastReply.updatedAt).toLocaleDateString() : 'N/A'}</span>
        </div>
        <div className="flex justify-center space-x-4">
          <div className="flex items-center space-x-1 border rounded-full px-4 py-1">
            <span className="font-semibold text-lg">{discussion.replies.length}</span>
            <span className="text-sm text-gray-500">Replies</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussionCard;
