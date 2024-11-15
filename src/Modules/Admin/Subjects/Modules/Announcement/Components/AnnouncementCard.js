import React, { useState, useRef, useEffect } from "react";
import { IoCalendarOutline } from "react-icons/io5";
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
  const toggleMenu = () => setMenuOpen(!menuOpen);

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
      className={`ps-1 rounded-md h-36 transition-all duration-300 ease-in-out hover:shadow-lg ${
        isRead ? "opacity-50" : ""
      }`}
    >
      <div className="border rounded-md shadow-sm relative flex bg-white justify-between p-4 h-36">
        <NavLink
          to={`/class/${cid}/${sid}/announcements/${_id}/view`}
          className="flex flex-col items-start justify-start transition-transform duration-300 ease-in-out hover:scale-105"
        >
          <h2 className="text-base font-semibold">{title}</h2>
          <p className="text-base text-green-600">{section}</p>
          <div className="flex justify-center items-center gap-1 mt-5 text-gray-500">
            <IoCalendarOutline />
            <p className="text-md">Created on:</p>
            <p className="text-md">
              {new Date(createdAt).toLocaleDateString()}
            </p>
          </div>
          {delayPosting && (
            <div className="flex justify-center items-center gap-1 mt-5 text-gray-500">
              <IoCalendarOutline />
              <p className="text-md">Posting on:</p>
              <p className="text-md">
                {new Date(delayPosting).toLocaleDateString()}
              </p>
            </div>
          )}
        </NavLink>
        <div className="flex flex-col gap-2 text-xl relative">
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
