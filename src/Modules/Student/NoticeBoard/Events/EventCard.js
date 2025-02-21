// EventCard.js
import React from "react";
import { MdAccessTime } from "react-icons/md";

const EventCard = ({ event, onClick }) => {
  const bgColors = [
    "#FF6C9C", // pink
    "#E24DFF", // purple
    "#21AEE7", // blue
    "#FBB778", // orange
  ];

  const eventId = event.id ?? 0;
  const bgColor = bgColors[eventId % bgColors?.length];

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-GB", options).replace(/ /g, "-");
  };

  // Function to format time
  const formatTime = (timeString) => {
    const [hour, minute] = timeString.split(":");
    const date = new Date();
    date.setHours(hour);
    date.setMinutes(minute);
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format
    return `${formattedHours}:${minutes} ${ampm}`;
  };

  const handleClick = () => {
    if (onClick) {
      onClick(event);
    }
  };

  const truncateText = (text, maxLength) => {
    return text?.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <div
      className="flex flex-col justify-between rounded-xl p-4 text-white shadow-lg m-2 cursor-pointer transform transition-transform duration-200 hover:scale-105 hover:shadow-xl"
      style={{ width: "220px", height: "180px", backgroundColor: bgColor }}
      onClick={handleClick}
    >
      <div className="flex items-start">
        <div className="flex items-center justify-center bg-white text-[#FF6C9C] rounded-lg p-2 w-12 h-12 text-2xl font-bold">
          {new Date(event.startDate).getDate()}
        </div>
        <div className="flex flex-col ml-2">
          <span className="text-lg font-semibold">
            {truncateText(event?.title, 11)}
          </span>
          <div className="flex items-center">
            <MdAccessTime className="mr-2 text-white text-lg" />
            <span>{event?.time}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-2 text-white font-inter text-sm font-semibold leading-[1.5]">
        <span>{truncateText(event?.description, 20)}</span>
        <span>{formatDate(event?.startDate)}</span>
      </div>
    </div>
  );
};

export default EventCard;
