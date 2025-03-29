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
  const randomIndex = Math.floor(Math.random() * colors?.length);
  return colors[randomIndex];
};

const AnnouncementCard = ({ title, date, section, id, isRead }) => {
  const { sid, cid } = useParams();
  const bgColor = getRandomColor();

  console.log("is read in card", isRead);

  return (
    <div
      style={{ backgroundColor: bgColor }}
      className="ps-1 rounded-md h-auto"
    >
      <div className="border rounded-md shadow-sm relative flex bg-white justify-between p-4 h-auto">
        <NavLink
          to={`/student_class/${cid}/${sid}/announcements/${id}/view`}
          className="flex flex-col items-start justify-start"
          state={{ id: id }}
        >
          <h2 className="text-base font-semibold">{title}</h2>
          <h2 className="text-base font-semibold">{!isRead && isRead}</h2>
          {/* <p className="text-base text-green-600">{section}</p> */}
          <div className="flex justify-center items-center gap-1 mt-5 text-gray-500">
            <div className="flex gap-1 items-center">
              <IoCalendarOutline /> <p className="text-md">Post On :</p>
              <p className="text-sm">{date}</p>
            </div>
          </div>
        </NavLink>
        {/* <div className="flex flex-col gap-2 text-xl">
          <button className="p-1 border rounded-full">
            <BiDotsVerticalRounded />
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default AnnouncementCard;
