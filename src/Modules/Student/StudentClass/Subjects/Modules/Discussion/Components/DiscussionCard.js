import React, { useState, useRef, useEffect } from "react";
import { FaEllipsisV } from "react-icons/fa";
import { IoCalendarOutline } from "react-icons/io5";
import { TbBookmark, TbBookmarkFilled } from "react-icons/tb";
import { GoDiscussionClosed } from "react-icons/go";
import { MdMarkEmailRead } from "react-icons/md";
import { NavLink, useParams } from "react-router-dom";
import useMarkAsRead from "../../../../../../../Hooks/AuthHooks/Student/Discussion/useMarkAsRead";
import useUpdatePinStatus from "../../../../../../../Hooks/AuthHooks/Staff/Admin/Disscussion/useUpdatePinStatus";

const DiscussionCard = ({ discussion, refetchClassDiscussions }) => {
  const { sid, cid } = useParams();
  const lastReply =
    discussion.replies.length > 0
      ? discussion.replies[discussion.replies.length - 1]
      : null;
  const { updatePinStatus, loading: pinLoading } = useUpdatePinStatus();
  const { markAsRead, loading: readLoading } = useMarkAsRead();
  const [isPinned, setIsPinned] = useState(discussion.isPinned);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handlePinClick = async () => {
    const updatedDiscussion = await updatePinStatus(discussion._id, !isPinned);
    if (updatedDiscussion) {
      setIsPinned(updatedDiscussion.isPinned);
      // Refetch discussions to reflect the change
      refetchClassDiscussions();
    }
  };

  const handleMarkAsReadClick = async () => {
    await markAsRead(discussion._id);
    setMenuOpen(false);
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
    <div className="p-4 bg-white shadow rounded-lg border transition-transform transform hover:scale-105 hover:shadow-lg">
      <div className="flex items-center justify-end space-x-2 mb-4 relative">
        {/* Pin button */}
        <button
          onClick={handlePinClick}
          disabled={pinLoading}
          className="transition-transform transform hover:scale-110"
          aria-label={isPinned ? "Unpin discussion" : "Pin discussion"}
        >
          {isPinned ? (
            <TbBookmarkFilled className="text-green-600 w-6 h-6" />
          ) : (
            <TbBookmark className="text-gray-400 w-6 h-6" />
          )}
        </button>

        {/* Ellipsis menu button */}
        <button
          className="border w-7 h-7 p-1 rounded-full transition-transform transform hover:scale-110"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="More options"
        >
          <FaEllipsisV />
        </button>

        {/* Dropdown menu */}
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="absolute right-0 top-full mt-2 w-48 bg-white border rounded-md shadow-lg z-10 transition-all transform origin-top-right"
          >
            <button
              className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-gray-100 w-full transition-transform transform hover:scale-105"
              onClick={handleMarkAsReadClick}
              disabled={readLoading}
            >
              <MdMarkEmailRead aria-hidden="true" />
              <span>{readLoading ? "Marking..." : "Mark as Read"}</span>
            </button>
          </div>
        )}
      </div>

      {/* Discussion title and link */}
      <NavLink
        to={`/student_class/${cid}/${sid}/discussions/${discussion._id}/view`}
        className="block transition-transform transform hover:scale-105"
        aria-label={`View discussion: ${discussion.title}`}
      >
        <div className="flex items-center justify-center mb-4">
          <GoDiscussionClosed className="w-16 h-16 p-2 border rounded-full text-green-500 transition-transform transform hover:scale-110" />
        </div>
        <div className="text-lg flex justify-center capitalize border-b pb-2">
          <span>{discussion.title}</span>
        </div>
      </NavLink>

      {/* Last post info */}
      <div className="mt-4 text-sm text-gray-600">
        <div className="flex justify-center text-lg items-center mb-7 space-x-2">
          <IoCalendarOutline
            className="w-4 h-4 transition-transform transform hover:scale-110"
            aria-hidden="true"
          />
          <span>
            Last Post at:{" "}
            {lastReply
              ? new Date(lastReply.updatedAt).toLocaleDateString()
              : "N/A"}
          </span>
        </div>

        {/* Replies and unread replies count */}
        <div className="flex justify-center space-x-4">
          <div className="flex items-center space-x-1 border rounded-full px-4 py-1">
            <span className="font-semibold text-lg">
              {discussion.replies.length}
            </span>
            <span className="text-sm text-gray-500">Replies</span>
          </div>
          <div className="flex items-center space-x-1 border rounded-full px-4 py-1">
            <span className="font-semibold text-lg">0</span>{" "}
            {/* Assuming unread replies are not tracked yet */}
            <span className="text-sm text-gray-500">Unread Replies</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussionCard;
