import React, { useMemo } from "react";
import { MdAccessTime } from "react-icons/md";
import { useTranslation } from "react-i18next"; // Import i18next

const EventCard = ({ event, onClick }) => {
  const { t } = useTranslation('prtEvents'); // Initialize i18next hook

  // Colors array for background colors, useMemo for optimization
  const bgColors = useMemo(() => [
    "#FF6C9C", // pink
    "#E24DFF", // purple
    "#21AEE7", // blue
    "#FBB778", // orange
  ], []);

  const eventId = event?.id ?? 0;
  const bgColor = bgColors[eventId % bgColors?.length];

  // Function to format date with locale, handling null or invalid dates
  const formatDate = (dateString) => {
    if (!dateString) return t('Invalid Date');
    const date = new Date(dateString);
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return isNaN(date) ? t('Invalid Date') : date.toLocaleDateString('en-GB', options).replace(/ /g, '-');
  };

 

  // Click handler with safety check for onClick function
  const handleClick = () => {
    if (onClick && typeof onClick === "function") {
      onClick(event);
    }
  };

  // Function to truncate text safely
  const truncateText = (text, maxLength) => {
    return text && text?.length > maxLength ? `${text.substring(0, maxLength)}...` : text ?? t('No Description');
  };

  // Memoized values for optimization
  const formattedDate = useMemo(() => formatDate(event?.startDate), [event?.startDate]);


  return (
    <div
      className="flex flex-col justify-between rounded-xl p-4 text-white shadow-lg m-2 cursor-pointer transform transition-transform duration-200 hover:scale-105 hover:shadow-xl"
      style={{ width: '220px', height: '180px', backgroundColor: bgColor }}
      onClick={handleClick}
    >
      <div className="flex items-start">
        <div className="flex items-center justify-center bg-white text-[#FF6C9C] rounded-lg p-2 w-12 h-12 text-2xl font-bold">
          {new Date(event?.startDate).getDate() ?? t('Invalid Date')}
        </div>
        <div className="flex flex-col ml-2">
          <span className="text-lg font-semibold">{truncateText(event?.title, 10)}</span>
          <div className="flex items-center">
            <MdAccessTime className="mr-2 text-white text-lg" />
            <span>{event.time}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-2 text-white font-inter text-sm font-semibold leading-[1.5]">
        <span>{truncateText(event?.description, 20)}</span>
        <span>{formattedDate}</span>
      </div>
    </div>
  );
};

export default React.memo(EventCard); // Memoized for optimization
