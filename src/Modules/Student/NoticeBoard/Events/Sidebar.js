import React from "react";
import { MdAccessTime, MdLocationOn, MdPersonOutline } from "react-icons/md";
import { BiCalendarEvent } from "react-icons/bi";
import { FaRegCalendarAlt, FaRegBookmark, FaRegStickyNote } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { gt } from "../../../../Utils/translator/translation";

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
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-1/3 p-6 h-full shadow-lg overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center shadow-md cursor-pointer transition duration-200"
        >
          <span className="text-gray-600 text-2xl font-bold">&times;</span>
        </button>


        {event && (
          <div className="flex flex-col gap-6">
            {/* Event Image */}
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-48 object-cover rounded-lg"
            />

            {/* Event Date and Time */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <BiCalendarEvent className="text-pink-500 text-2xl" />
                <span className="text-gray-700 font-medium">{startDateTime.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <MdAccessTime className="text-orange-500 text-2xl" />
                <span className="text-gray-700 font-medium">{event.time}</span>
              </div>
            </div>

            {/* Event Title */}
            <h1 className="text-2xl font-bold text-gray-800">{event.title}</h1>

            {/* Event Details */}
            <div className="space-y-4">
              {/* Location */}
              <div className="flex items-start gap-2">
                <MdLocationOn className="text-purple-500 text-2xl" />
                <div>
                  <span className="text-gray-400 block">{t("Location", gt.stdEvents)}</span>
                  <p className="text-gray-800 font-medium">{event.location}</p>
                </div>
              </div>

              {/* Event Director */}
              <div className="flex items-start gap-2">
                <MdPersonOutline className="text-blue-500 text-2xl" />
                <div>
                  <span className="text-gray-400 block">{t("Event Director", gt.stdEvents)}</span>
                  <p className="text-gray-800 font-medium">{event.director}</p>
                </div>
              </div>

              {/* Event Type */}
              <div className="flex items-start gap-2">
                <FaRegBookmark className="text-green-500 text-2xl" />
                <div>
                  <span className="text-gray-400 block">{t("Event Type", gt.stdEvents)}</span>
                  <p className="text-gray-800 font-medium">{event.type || t("No Type Available")}</p>
                </div>
              </div>

              {/* Event Name */}
              <div className="flex items-start gap-2">
                <FaRegCalendarAlt className="text-red-500 text-2xl" />
                <div>
                  <span className="text-gray-400 block">{t("Event name", gt.stdEvents)}</span>
                  <p className="text-gray-800 font-medium">{event.title}</p>
                </div>
              </div>

              {/* Event Description */}
              <div className="flex items-start gap-2">
                <FaRegStickyNote className="text-yellow-500 text-2xl" />
                <div>
                  <span className="text-gray-400 block">{t("Event Description", gt.stdEvents)}</span>
                  <p className="text-sm text-gray-600">
                    {event.description || t("No Details Available")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
