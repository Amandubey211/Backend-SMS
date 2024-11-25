import React, { useState, useRef, useEffect } from "react";
import {
  IoCalendarOutline,
  IoCheckmarkCircleOutline,
  IoTimeOutline,
  IoWarningOutline,
} from "react-icons/io5";
import { NavLink, useParams } from "react-router-dom";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { AiOutlineCheck } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { markAsReadAnnouncement } from "../../../../../../Store/Slices/Admin/Class/Announcement/announcementThunk";

const AnnouncementCard = ({
  title,
  date,
  section,
  _id,
  color,
  isRead,
  createdAt,
  delayPosting,
}) => {
  const { sid, cid } = useParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const dispatch = useDispatch();

  // Toggle dropdown menu

  // Close dropdown when clicking outside
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
  };

  const handleMarkAsRead = () => {
    dispatch(markAsReadAnnouncement(_id)); // Use _id instead of id
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

  return (
    <div
      style={{ backgroundColor: color }}
      className={`ps-1 rounded-md h-36 hover:scale-105 transition-all duration-200 ease-in-out hover:shadow-lg ${
        isRead ? "opacity-50" : ""
      }`}
    >
      <div
        className={`border rounded-md shadow-sm relative flex bg-white hover:bg-[${color}]-50  justify-between p-4 h-36`}
      >
        {/* Badge for Posted, Scheduled, or Not Scheduled */}
        <div className="absolute top-2 right-2">
          {delayPosting ? (
            new Date() > new Date(delayPosting) ? (
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
            <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
              <IoWarningOutline className="text-base" />
              Not Scheduled
            </span>
          )}
        </div>

        <NavLink
          to={`/class/${cid}/${sid}/announcements/${_id}/view`}
          className="flex flex-col p-4 transition-transform duration-300 ease-in-out "
        >
          {/* Header Section */}
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          </div>

          {/* Section Name */}
          <p className="text-sm text-green-600 mb-3">{section}</p>

          {/* Dates Section */}
          <div className="flex flex-col gap-2 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <IoCalendarOutline className="text-lg" />
              <span>Created on:</span>
              <span>{new Date(createdAt).toLocaleDateString()}</span>
            </div>
            {delayPosting && (
              <div className="flex items-center gap-2">
                <IoCalendarOutline className="text-lg" />
                <span>Posting on:</span>
                <span>{new Date(delayPosting).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </NavLink>

        {/* Action Buttons Section */}
        <div className="flex flex-col gap-2 text-xl relative">
          {/* Keep the commented part */}
          {/* <button
          className="p-1 border rounded-full transition-all duration-300 ease-in-out hover:bg-gray-200"
          onClick={toggleMenu}
        >
          <BiDotsVerticalRounded />
        </button>
        {menuOpen && (
          <div
            ref={menuRef}
            className="absolute right-0 top-10 w-48 bg-white border rounded shadow-md transition-all duration-300 ease-in-out"
          >
            <button
              className="w-full flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
              onClick={handleMarkAsRead}
            >
              <AiOutlineCheck className="text-green-600" />
              <span>Mark as Read</span>
            </button>
          </div>
        )} */}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementCard;
