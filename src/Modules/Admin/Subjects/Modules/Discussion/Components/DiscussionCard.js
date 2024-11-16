import React, { useState, useRef, useEffect } from "react";
import { FaEllipsisV } from "react-icons/fa";
import {
  MdPushPin,
  MdOutlinePushPin,
  MdCalendarToday,
  MdOutlineBlock,
} from "react-icons/md";
import { BsPatchCheckFill } from "react-icons/bs";
import { GoDiscussionClosed } from "react-icons/go";
import { MdMarkEmailRead } from "react-icons/md";
import { NavLink, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  markAsReadDiscussion,
  updatePinStatus,
} from "../../../../../../Store/Slices/Admin/Class/Discussion/discussionThunks";

const DiscussionCard = ({ discussion, fetchClassDiscussions }) => {
  const { sid, cid } = useParams();
  const lastReply =
    discussion.replies.length > 0
      ? discussion.replies[discussion.replies.length - 1]
      : null;

  const dispatch = useDispatch();
  const [isPinned, setIsPinned] = useState(discussion.isPinned);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handlePinClick = async () => {
    const updatedDiscussion = await dispatch(
      updatePinStatus({ discussionId: discussion._id, isPinned: !isPinned })
    );
    if (updatedDiscussion) {
      setIsPinned(updatedDiscussion.isPinned);
      fetchClassDiscussions(); // Refetch discussions after pin/unpin
    }
  };

  const handleMarkAsReadClick = async () => {
    await dispatch(markAsReadDiscussion({ discussionId: discussion._id }));
    setMenuOpen(false);
    fetchClassDiscussions(); // Refetch discussions after marking as read
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div className="relative p-4 bg-white shadow rounded-lg border transition-transform transform hover:scale-105 hover:shadow-lg">
      {/* Unread Badge */}
      {!discussion.isRead && (
        <div className="absolute top-2 left-2 bg-red-200 text-red-700 text-xs font-semibold rounded-full px-2 py-1">
          Unread
        </div>
      )}
      <div className="flex items-center justify-end space-x-2 mb-4 relative">
        <button
          onClick={handlePinClick}
          disabled={discussion.pinLoading}
          className="transition-transform transform hover:scale-110"
        >
          {isPinned ? (
            <MdPushPin className="text-green-600 w-6 h-6" />
          ) : (
            <MdOutlinePushPin className="text-gray-400 w-6 h-6" />
          )}
        </button>

        {/* {discussion.pulish ? (
          <BsPatchCheckFill className="text-green-600 w-6 h-6 transition-transform transform hover:scale-110" />
        ) : (
          <BsPatchCheckFill className="text-green-600 w-6 h-6 transition-transform transform hover:scale-110" />
        )} */}

        {!discussion.publish ? (
          <>
            <BsPatchCheckFill
              aria-hidden="true"
              className="text-green-600 w-6 h-6 transition-transform transform hover:scale-110"
            />
          </>
        ) : (
          <>
            <MdOutlineBlock
              aria-hidden="true"
              className="text-gray-600 w-6 h-6 transition-transform transform hover:scale-110"
            />
          </>
        )}

        <button
          className="border w-7 h-7 p-1 rounded-full transition-transform transform hover:scale-110"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <FaEllipsisV />
        </button>
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="absolute right-0 top-full mt-2 w-48 bg-white border rounded-md shadow-lg z-50 transition-all transform scale-100 origin-top-right animate-fade-in"
          >
            <button
              className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-gray-100 w-full transition-transform transform hover:scale-105"
              onClick={handleMarkAsReadClick}
              disabled={discussion.readLoading}
            >
              <MdMarkEmailRead aria-hidden="true" />
              <span>
                {" "}
                {discussion.readLoading ? "Marking.." : "Mark as Read"}
              </span>
            </button>
          </div>
        )}
      </div>
      <NavLink
        to={`/class/${cid}/${sid}/discussions/${discussion._id}/view`}
        className="block transition-transform transform hover:scale-105"
      >
        <div className="flex items-center justify-center mb-4">
          <GoDiscussionClosed className="w-16 h-16 p-2 border rounded-full text-green-500 transition-transform transform hover:scale-110" />
        </div>
        <div className="text-lg flex justify-center capitalize border-b pb-2">
          <span>{discussion.title}</span>
        </div>
      </NavLink>
      <div className="mt-4 text-sm text-gray-600">
        <div className="flex justify-center items-center mb-7 space-x-2">
          <MdCalendarToday className="w-4 h-4 transition-transform transform hover:scale-110" />
          <span>
            Last Post at:{" "}
            {lastReply
              ? new Date(lastReply.updatedAt).toLocaleDateString()
              : "N/A"}
          </span>
        </div>
        <div className="flex justify-center space-x-4">
          <div className="flex items-center space-x-1 border rounded-full px-4 py-1">
            <span className="font-semibold text-lg">
              {discussion.replies.length}
            </span>
            <span className="text-sm text-gray-500">Replies</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussionCard;
