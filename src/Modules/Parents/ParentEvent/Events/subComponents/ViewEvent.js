import React, { useMemo } from "react";
import { ReactComponent as CalendarIcon } from '../../../../../Assets/StudentAssets/calendar-icon.svg';
import { ReactComponent as ClockIcon } from '../../../../../Assets/StudentAssets/clock-icon.svg';
import { ReactComponent as LocationIcon } from '../../../../../Assets/StudentAssets/location-icon.svg';
import { ReactComponent as PersonIcon } from '../../../../../Assets/StudentAssets/person-icon.svg';
import { useTranslation } from 'react-i18next'; // Import i18next

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
    <div className="px-4 bg-white rounded-lg overflow-auto" style={{ maxHeight: "90vh" }}>
      <div className="flex flex-col gap-2">
        {/* Event Image */}
        <img className="h-[200px] w-full rounded" src={event?.image ?? '/default-event.jpg'} alt={t("Event Image")} />

        {/* Grouped Date, Time, Location, and Director */}
        <div className="flex justify-between gap-4 mt-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center">
              <div className="bg-pink-500 p-2 rounded-full">
                <CalendarIcon className="text-white" />
              </div>
              <div className="flex flex-col ml-2">
                <span className="text-gray-400">{t("Event Date")}</span>
                <span className="text-pink-500">{startDateTime.date}</span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-purple-500 p-2 rounded-full">
                <LocationIcon className="text-white" />
              </div>
              <div className="flex flex-col ml-2">
                <span className="text-gray-400">{t("Location")}</span>
                <span className="text-lg">{formattedLocation}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 mr-8">
            <div className="flex items-center">
              <div className="bg-orange-500 p-2 rounded-full">
                <ClockIcon className="text-white" />
              </div>
              <div className="flex flex-col ml-2">
                <span className="text-gray-400">{t("Event Time")}</span>
                <span className="text-orange-500">{formattedTime}</span>
              </div>
            </div>

            <div className="flex items-center">
              <div className="bg-blue-500 p-2 rounded-full">
                <PersonIcon className="text-white" />
              </div>
              <div className="flex flex-col ml-2">
                <span className="text-gray-400">{t("Event Director")}</span>
                <span className="text-lg">{formattedDirector}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Line break */}
        <hr className="my-4" />

        {/* Event Name */}
        <h1 className="font-bold text-[#4D4D4D] text-2xl">{formattedTitle}</h1>

        {/* Event Type */}
        <div className="flex flex-col mt-4">
          <span className="text-gray-400">{t("Event Type")}</span>
          <span className="text-lg">{formattedType}</span>
        </div>

        {/* Event Description */}
        <div className="text-lg leading-[1.875] mt-4" style={{ color: "#7F7F7F", fontSize: "16px" }}>
          {formattedDescription}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ViewEvent); // Memoized for optimization
