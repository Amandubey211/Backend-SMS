import React, { useMemo } from "react";
import { ReactComponent as CalendarIcon } from '../../../../../Assets/StudentAssets/calendar-icon.svg';
import { ReactComponent as ClockIcon } from '../../../../../Assets/StudentAssets/clock-icon.svg';
import { ReactComponent as LocationIcon } from '../../../../../Assets/StudentAssets/location-icon.svg';
import { ReactComponent as PersonIcon } from '../../../../../Assets/StudentAssets/person-icon.svg';
import { useTranslation } from 'react-i18next'; // Import i18next
import { MdAccessTime, MdPersonOutline } from "react-icons/md";
import { FaCalendarDays } from "react-icons/fa6";
import { CiLocationOn } from "react-icons/ci";
const ViewEvent = ({ event }) => {
  const { t } = useTranslation('prtEvents'); // Initialize i18next hook

  // Function to format date and time
  const formatDateTime = (date) => {
    if (!date) return { date: t("Invalid Date"), time: t("Invalid Time") };
    const options = { year: "numeric", month: "long", day: "numeric" };
    const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: true };
    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) return { date: t("Invalid Date"), time: t("Invalid Time") };
    return {
      date: parsedDate.toLocaleDateString(undefined, options),
      time: parsedDate.toLocaleTimeString(undefined, timeOptions),
    };
  };

  // Memoized formatted start and end dates for optimization
  const startDateTime = useMemo(() => formatDateTime(event?.startDate), [event?.startDate]);
  const endDateTime = useMemo(() => formatDateTime(event?.endDate), [event?.endDate]);

  // Memoized fallback values for missing or invalid fields
  const formattedTitle = event?.title || t('No Title Available');
  const formattedDescription = event?.description || t('No Details Available');
  const formattedLocation = event?.location || t('No Location Available');
  const formattedDirector = event?.director || t('No Director Available');
  const formattedType = event?.type || t('No Type Available');
  const formattedTime = event?.time ? event?.time : t('Invalid Time');

  return (
    <div className="px-4 py-4  flex flex-col h-full max-w-xl mx-auto">
      <div className="flex-grow overflow-auto p-4 no-scrollbar">
        {/* Event Image */}
        {event?.image ? (
          <img className="w-full h-64 object-cover rounded-lg" src={event.image} alt={t("Event Image")} />
        ) : (
          <img className="w-full h-64 object-cover rounded-lg" src="/default-event.jpg" alt={t("Event Image")} />
        )}

        {/* Date, Time, Location, and Director */}
        <div className="flex justify-between gap-4 mt-4">
          <div className="flex flex-col gap-4">
            {/* Date */}
            <div className="flex items-center">
              <div className="bg-red-500 p-2 rounded-full">
                <FaCalendarDays className="text-white text-lg" />
              </div>
              <div className="flex flex-col ml-2">
                <span className="text-gray-500 text-sm">{t("Event Date")}</span>
                <span className="text-red-500 text-md">{startDateTime.date || t("N/A")}</span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center">
              <div className="bg-purple-500 p-2 rounded-full">
                <CiLocationOn className="text-white text-lg" />
              </div>
              <div className="flex flex-col ml-2">
                <span className="text-gray-500 text-sm">{t("Location")}</span>
                <span className="text-md truncate max-w-xs" title={formattedLocation}>
                  {formattedLocation || t("N/A")}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 mr-8">
            {/* Time */}
            <div className="flex items-center">
              <div className="bg-blue-500 p-2 rounded-full">
                <MdAccessTime className="text-white text-lg" />
              </div>
              <div className="flex flex-col ml-2">
                <span className="text-gray-500 text-sm">{t("Event Time")}</span>
                <span className="text-blue-500 text-md">{formattedTime || t("N/A")}</span>
              </div>
            </div>

            {/* Director */}
            <div className="flex items-center">
              <div className="bg-orange-500 p-2 rounded-full">
                <MdPersonOutline className="text-white text-lg" />
              </div>
              <div className="flex flex-col ml-2">
                <span className="text-gray-500 text-sm">{t("Event Director")}</span>
                <span className="text-md truncate max-w-xs" title={formattedDirector}>
                  {formattedDirector || t("N/A")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Line break */}
        <hr className="my-4" />

        {/* Event Title */}
        <h2 className="text-gray-500 text-lg font-semibold mb-1">{t("Event Title")}</h2>
        <h1 className="font-bold text-gray-700 text-2xl mb-2">{formattedTitle}</h1>

        {/* Event Type */}
        <div className="flex flex-col mt-4">
          <span className="text-gray-500 text-lg font-semibold mb-1">{t("Event Type")}</span>
          <span className="inline-block bg-blue-100 text-blue-600 rounded-full px-3 py-1 text-sm font-medium w-fit">
            {formattedType || t("N/A")}
          </span>
        </div>

        {/* Event Description */}
        <div className="bg-white rounded-lg mt-4 text-lg leading-[1.875]" style={{ color: "#4D4D4D", fontSize: "16px" }}>
          {/* Title for description */}
          <span className="text-gray-500 text-lg font-semibold mb-2 block">{t("Event Description")}</span>

          {/* Description content (properly aligned and not wrapped inside a styled tag) */}
          {formattedDescription || t("No description available")}
        </div>
      </div>
    </div>

  );
};

export default React.memo(ViewEvent); // Memoized for optimization
