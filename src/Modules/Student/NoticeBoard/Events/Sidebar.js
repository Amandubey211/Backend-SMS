import React from "react";
import { MdAccessTime, MdLocationOn, MdPersonOutline } from "react-icons/md";
import { BiCalendarEvent } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import { gt } from "../../../../Utils/translator/translation";

const Sidebar = ({ isOpen, onClose, event }) => {
  const {t}=useTranslation();
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
  const endDateTime = formatDateTime(new Date(event.endDate));

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-1/3 p-4 h-full shadow-lg overflow-y-auto">
        <button
          onClick={onClose}
          className="text-gray-500 text-2xl font-semibold mb-4"
        >
          &times;
        </button>
        {event && (
          <div className="flex flex-col gap-1">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-48 object-cover mb-4 rounded"
            />
            <div className="flex justify-around items-center mb-4">
              <div className="flex items-center gap-1">
                <BiCalendarEvent className="text-pink-500 text-2xl" />
                <span className="text-pink-500">{startDateTime.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <MdAccessTime className="text-orange-500 text-2xl" />
                <span className="text-orange-500">{event.time}</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">{event.title}</h1>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1">
                <MdLocationOn className="text-purple-500 text-2xl" />
                <div>
                  <span className="text-gray-400">{t('Location',gt.stdEvents)}</span>
                  <p className="text-gray-800">{event.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MdPersonOutline className="text-blue-500 text-2xl" />
                <div>
                  <span className="text-gray-400">{t("Event Director",gt.stdEvents)}</span>
                  <p className="text-gray-800">{event.director}</p>
                </div>
              </div>
              <div>
                <span className="text-gray-400">{t("Event Type",gt.stdEvents)}</span>
                <p className="text-gray-800">{event.type || t("No Type Available")}</p>
              </div>
              <div>
                <span className="text-gray-400">{t("Event name",gt.stdEvents)}</span>
                <p className="text-gray-800">{event.title}</p>
              </div>
              <p className="text-sm text-gray-600 ml-5">{event.description || t("No Details Available")}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
