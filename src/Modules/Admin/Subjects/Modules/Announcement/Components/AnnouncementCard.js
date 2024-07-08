<<<<<<< HEAD
import React from "react";
import { IoCalendarOutline } from "react-icons/io5";
import { NavLink, useParams } from "react-router-dom";
import { BiDotsVerticalRounded } from "react-icons/bi";
const colors = [
  "#efc42f",
  "#ee69b6",
  "#0066ad",
  "#b2cd09",
  "#5ac67c",
  "#e040ff",
  "#fd8263",
  "#5b9ef2",
  "#9966f6",
  "#5ac67c",
];

const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};


const AnnouncementCard = ({ title, date, section,id }) => {
    const {sid,cid} = useParams()
  const bgColor = getRandomColor();

  return (
    <div style={{ backgroundColor: bgColor }} className="ps-1 rounded-md h-36">
      <div className="border rounded-md shadow-sm relative flex bg-white justify-between p-4 h-36">
        <NavLink to={`/class/${cid}/${sid}/announcements/${id}/view`} className="flex flex-col items-start justify-start">
          <h2 className="text-base font-semibold">{title}</h2>

          <p className="text-base text-green-600">{section}</p>
          <div className="flex justify-center items-center gap-1 mt-5 text-gray-500">
            <div className="flex gap-1 items-center">
              <IoCalendarOutline /> <p className="text-md ">Post On :</p>
            </div>
            <p className="text-xs ">{date}</p>
          </div>
        </NavLink>
        <div className="flex flex-col gap-2 text-xl">
          <button  className=" p-1 border rounded-full">
          <BiDotsVerticalRounded />
      
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementCard;
=======
import React, { useState, useRef, useEffect } from "react";
import { IoCalendarOutline } from "react-icons/io5";
import { NavLink, useParams } from "react-router-dom";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { AiOutlineCheck } from "react-icons/ai";
import useMarkAsReadAnnouncement from "../../../../../../Hooks/AuthHooks/Staff/Admin/Announcement/useMarkAsReadAnnouncement";

const AnnouncementCard = ({ title, date, section, id, color }) => {
  const { sid, cid } = useParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { markAsReadAnnouncement, loading } = useMarkAsReadAnnouncement();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
  };

  const handleMarkAsRead = async () => {
    await markAsReadAnnouncement(id);
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
    <div style={{ backgroundColor: color }} className="ps-1 rounded-md h-36">
      <div className="border rounded-md shadow-sm relative flex bg-white justify-between p-4 h-36">
        <NavLink to={`/class/${cid}/${sid}/announcements/${id}/view`} className="flex flex-col items-start justify-start">
          <h2 className="text-base font-semibold">{title}</h2>
          <p className="text-base text-green-600">{section}</p>
          <div className="flex justify-center items-center gap-1 mt-5 text-gray-500">
            <div className="flex gap-1 items-center">
              <IoCalendarOutline /> <p className="text-md">Post On :</p>
            </div>
            <p className="text-xs">{new Date(date).toLocaleDateString()}</p>
          </div>
        </NavLink>
        <div className="flex flex-col gap-2 text-xl relative">
          <button className="p-1 border rounded-full" onClick={toggleMenu}>
            <BiDotsVerticalRounded />
          </button>
          {menuOpen && (
            <div ref={menuRef} className="absolute right-0 top-10 w-48 bg-white border rounded shadow-md">
              <button
                className="w-full flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                onClick={handleMarkAsRead}
                disabled={loading}
              >
                <AiOutlineCheck className="text-green-600" />
                <span>{loading ? "Marking..." : "Mark as Read"}</span>
              </button>
              {/* Add more menu items here if needed */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementCard;
>>>>>>> main
