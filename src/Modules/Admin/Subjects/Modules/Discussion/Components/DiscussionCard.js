import React from "react";
import { FaEllipsisV } from "react-icons/fa";
import { IoCalendarOutline } from "react-icons/io5";
import { TbBookmark } from "react-icons/tb";
import { BsPatchCheckFill } from "react-icons/bs";
import { GoDiscussionClosed } from "react-icons/go";

const DiscussionCard = ({ discussion }) => {
  return (
    <div className="p-4 bg-white shadow rounded-lg border">
      <div className="flex items-center justify-end space-x-2 mb-4">
        <TbBookmark className="text-gray-400 w-6 h-6" />
        <BsPatchCheckFill className="text-green-600 w-6 h-6" />
        <FaEllipsisV className="border w-7 h-7 p-1 rounded-full" />
      </div>
      <div className="flex items-center justify-center mb-4">
        <GoDiscussionClosed className="w-16 h-16 p-2 border rounded-full text-green-500" />
      </div>
      <h3 className="text-lg text-center border-b pb-2">{discussion.title}</h3>
      <div className="mt-4 text-sm text-gray-600">
        <div className="flex justify-center items-center mb-7 space-x-2">
          <IoCalendarOutline className="w-4 h-4" />
          <span>Last Post at: {discussion.lastPostDate}</span>
          <span className="text-green-600">({discussion.lastPostTime})</span>
        </div>
        <div className="flex justify-center space-x-4">
          <div className="flex items-center space-x-1 border rounded-full px-4 py-1">
            <span className="font-semibold text-lg">{discussion.unreadReplies}</span>
            <span className="text-sm text-gray-500">Unread Reply</span>
          </div>
          <div className="flex items-center space-x-1 border rounded-full px-4 py-1">
            <span className="font-semibold text-lg">{discussion.replies}</span>
            <span className="text-sm text-gray-500">Reply</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussionCard;
