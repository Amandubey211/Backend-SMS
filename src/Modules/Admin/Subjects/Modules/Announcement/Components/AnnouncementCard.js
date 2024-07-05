import React from "react";
import { IoCalendarOutline } from "react-icons/io5";
import { NavLink, useParams } from "react-router-dom";
import { BiDotsVerticalRounded } from "react-icons/bi";

const AnnouncementCard = ({ title, date, section, id, color }) => {
  const { sid, cid } = useParams();

  return (
    <div style={{ backgroundColor: color }} className="ps-1 rounded-md h-36">
      <div className="border rounded-md shadow-sm relative flex bg-white justify-between p-4 h-36">
        <NavLink to={`/class/${cid}/${sid}/announcements/${id}/view`} className="flex flex-col items-start justify-start">
          <h2 className="text-base font-semibold">{title}</h2>
          <p className="text-base text-green-600">{section}</p>
          <div className="flex justify-center items-center gap-1 mt-5 text-gray-500">
            <div className="flex gap-1 items-center">
              <IoCalendarOutline /> <p className="text-md ">Post On :</p>
            </div>
            <p className="text-xs ">{new Date(date).toLocaleDateString()}</p>
          </div>
        </NavLink>
        <div className="flex flex-col gap-2 text-xl">
          <button className="p-1 border rounded-full">
            <BiDotsVerticalRounded />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementCard;
