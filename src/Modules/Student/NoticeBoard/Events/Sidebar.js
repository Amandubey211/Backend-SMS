import React from "react";
import { MdAccessTime, MdLocationOn, MdPersonOutline } from "react-icons/md";
import { BiCalendarEvent } from "react-icons/bi";
import {
  FaRegCalendarAlt,
  FaRegBookmark,
  FaRegStickyNote,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { gt } from "../../../../Utils/translator/translation";
import EventDescription from "./EventDescription";
import "./sidebar.css";

const Sidebar = ({ isOpen, onClose, event }) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  const formatDateTime = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: true };
    return {
      date: date.toLocaleDateString(undefined, options),
      time: date.toLocaleTimeString(undefined, timeOptions),
    };
  };

  const startDateTime = formatDateTime(new Date(event.startDate));

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50 flex justify-end capitalize">
      <div className="bg-white w-1/3 p-6 h-full shadow-lg relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center shadow-md cursor-pointer transition duration-200"
        >
          <span className="text-gray-600 text-2xl font-bold">&times;</span>
        </button>

        {event && (
          <div className="flex flex-col gap-2  h-full overflow-y-auto custom-scrollbar">
            {/* Event Image */}
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-[250px] object-cover rounded-lg"
            />

            {/* Event Date and Time */}
            <div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <BiCalendarEvent className="text-gray-500 text-lg" />
                  <span className="text-gray-500 font-medium text-sm">
                    {startDateTime.date}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <MdAccessTime className="text-gray-500 text-lg" />
                  <span className="text-gray-500 text-sm font-medium">
                    {event.time}
                  </span>
                </div>
              </div>

              {/* Event Title */}
              <h1 className="text-xl py-3 text-wrap break-words font-semibold bg-gradient-to-r from-[#C83B62] to-[#7F35CD]  bg-clip-text text-transparent ">
                {event.title}
              </h1>

              {/* Event Details */}
              <div className="flex flex-col space-y-1">
                {/* Location */}
                <div className="flex flex-row items-start gap-1">
                  {/* <MdLocationOn className="text-gray-400 text-2xl mt-1" /> */}
                  <div>
                    <span className="text-gray-500 block text-sm capitalize">
                      {t("Location", gt.stdEvents)}
                    </span>
                    <p className="text-black font-medium">{event.location}</p>
                  </div>
                </div>

                {/* Event Director */}
                <div className="flex  flex-row  items-start gap-2">
                  {/* <MdPersonOutline className="text-gray-400 text-2xl mt-1" /> */}
                  <div>
                    <span className="text-gray-500 block  text-sm capitalize">
                      {t("Event Director", gt.stdEvents)}
                    </span>
                    <p className="text-black font-medium">{event.director}</p>
                  </div>
                </div>

                {/* Event Type */}
                <div className="flex flex-row items-start gap-2">
                  {/* <FaRegBookmark className="text-gray-400 text-md mt-2" /> */}
                  <div>
                    <span className="text-gray-500 block text-sm">
                      {t("Event Type", gt.stdEvents)}
                    </span>
                    <p className="text-black font-medium">
                      {event.type || t("No Type Available")}
                    </p>
                  </div>
                </div>

                {/* Event Name */}
                <div className="flex  flex-row  items-start  gap-2">
                  {/* <FaRegCalendarAlt className="text-gray-400 text-lg mt-2" /> */}
                  <div className="w-full">
                    <span className="text-gray-500 block text-sm">
                      {t("Event name", gt.stdEvents)}
                    </span>
                    <p className="text-gray-800  font-medium text-wrap break-words">
                      {event.title}
                    </p>
                  </div>
                </div>

                {/* Event Description */}
                <EventDescription description={event.description} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
