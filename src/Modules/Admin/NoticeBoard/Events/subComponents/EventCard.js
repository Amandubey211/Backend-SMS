import React from "react";
import { MdAccessTime } from "react-icons/md";
import { useDispatch } from "react-redux";
import {
  setSelectedEvent,
  setSidebarContent,
} from "../../../../../Store/Slices/Admin/NoticeBoard/Events/eventSlice";
import { useTranslation } from "react-i18next";

// Rainbow gradients (same as scheduler)
const eventColors = [
  "bg-gradient-to-r from-red-400 to-orange-400",
  "bg-gradient-to-r from-orange-400 to-yellow-400",
  "bg-gradient-to-r from-yellow-400 to-green-400",
  "bg-gradient-to-r from-green-400 to-blue-400",
  "bg-gradient-to-r from-blue-400 to-indigo-400",
  "bg-gradient-to-r from-indigo-400 to-purple-400",
  "bg-gradient-to-r from-purple-400 to-pink-400",
];

const truncate = (str, len) =>
  !str ? "" : str.length > len ? `${str.slice(0, len)}…` : str;

const EventCard = ({ event, colorIndex = 0, onClick }) => {
  const { t } = useTranslation("admEvent");
  const dispatch = useDispatch();
  const idx = colorIndex % eventColors.length;
  const bg = eventColors[idx];

  const handleClick = () => {
    dispatch(setSelectedEvent(event));
    dispatch(setSidebarContent("viewEvent"));
    onClick?.();
  };

  return (
    <div
      onClick={handleClick}
      className={`w-full flex flex-col justify-between ${bg}
                 text-gray-800 shadow-lg rounded-lg
                 p-4 h-48 cursor-pointer transition hover:shadow-xl`}
    >
      <div className="flex items-start">
        <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-white flex items-center justify-center text-purple-500 font-bold text-xl">
          {event.date ? new Date(event.date).getDate() : t("N/A")}
        </div>
        <div className="ml-2 flex-1">
          <h3 className="text-lg font-semibold truncate">
            {truncate(event.title, 12) || t("Untitled event")}
          </h3>
          <div className="flex items-center text-sm text-gray-700">
            <MdAccessTime className="mr-1" />
            {event.time || t("No time")}
          </div>
        </div>
      </div>
      <div className="text-sm mt-2 overflow-hidden flex-1">
        <p className="truncate">{truncate(event.description, 30)}</p>
        <p className="mt-1 text-xs">
          {event.date
            ? new Date(event.date).toLocaleDateString()
            : t("Invalid date")}
        </p>
      </div>
    </div>
  );
};

export default EventCard;
