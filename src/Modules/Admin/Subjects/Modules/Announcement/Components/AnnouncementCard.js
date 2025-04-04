import React, { useState, useRef, useEffect } from "react";
import { IoCheckmarkCircleOutline, IoTimeOutline } from "react-icons/io5";
import { AiOutlineUser } from "react-icons/ai";
import { NavLink, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { markAsReadAnnouncement } from "../../../../../../Store/Slices/Admin/Class/Announcement/announcementThunk";
import { Space, Divider, Tooltip, Tag } from "antd";

const AnnouncementCard = ({
  title,
  content, // available but not displayed
  attachment, // optional: can be used for file attachments if needed
  author,
  postTo,
  _id,
  color,
  isRead,
  createdAt,
  delayPosting,
  sectionId, // array for sections
  groupId, // array for groups
}) => {
  const { sid, cid } = useParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const dispatch = useDispatch();

  // Close dropdown when clicking outside (if used in future)
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
  };

  const handleMarkAsRead = () => {
    dispatch(markAsReadAnnouncement(_id));
    setMenuOpen(false);
  };

  useEffect(() => {
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const now = new Date();
  const isScheduled = delayPosting && new Date(delayPosting) > now;
  const isPosted =
    !delayPosting || (delayPosting && new Date(delayPosting) <= now);

  // Determine the target tag
  let targetTag = null;
  if (postTo === "Everyone") {
    targetTag = <Tag color="blue">Everyone</Tag>;
  } else if (postTo === "Section") {
    targetTag = (
      <Tag color="blue">
        Section {sectionId && sectionId.length ? `(${sectionId.length})` : ""}
      </Tag>
    );
  } else if (postTo === "Group") {
    targetTag = (
      <Tag color="blue">
        Group {groupId && groupId.length ? `(${groupId.length})` : ""}
      </Tag>
    );
  }

  return (
    <div
      style={{ backgroundColor: color }}
      className={`ps-1 rounded-md h-40 hover:scale-105 transition-all duration-200 ease-in-out hover:shadow-lg ${
        isRead ? "opacity-50" : ""
      }`}
    >
      <div className="border rounded-md shadow-sm relative flex flex-col bg-white p-4 h-40">
        {/* Badge for Posted or Scheduled */}
        <div className="absolute top-2 right-2">
          {delayPosting ? (
            isPosted ? (
              <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-600 text-xs font-medium rounded-full">
                <IoCheckmarkCircleOutline className="text-base" />
                Posted
              </span>
            ) : (
              <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-600 text-xs font-medium rounded-full">
                <IoTimeOutline className="text-base" />
                Scheduled
              </span>
            )
          ) : (
            <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-600 text-xs font-medium rounded-full">
              <IoCheckmarkCircleOutline className="text-base" />
              Posted
            </span>
          )}
        </div>

        <NavLink
          to={`/class/${cid}/${sid}/announcements/${_id}/view`}
          className="flex flex-col h-full justify-between"
        >
          <div>
            {/* Title */}
            <Tooltip title={title}>
              <h2
                className="text-lg font-semibold text-gray-800 w-48 whitespace-nowrap overflow-ellipsis overflow-hidden"
                style={{ textTransform: "capitalize" }}
              >
                {title}
              </h2>
            </Tooltip>

            {/* Author Info */}
            <div className="flex items-center text-md text-gray-600 my-1">
              <AiOutlineUser className="mr-1" />
              <span>{author}</span>
            </div>

            {/* Target Tag */}
            <div>{targetTag}</div>
          </div>

          {/* Dates at Bottom */}
          <div className="mt-2">
            <div className="flex items-center text-md text-gray-500">
              <span>Created: {new Date(createdAt).toLocaleDateString()}</span>
              {delayPosting && (
                <>
                  <Divider type="vertical" />
                  <span>
                    Posting: {new Date(delayPosting).toLocaleDateString()}
                  </span>
                </>
              )}
            </div>
          </div>
        </NavLink>
      </div>
    </div>
  );
};

export default AnnouncementCard;
