// EventCard.js
import { Tooltip } from "antd";
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
      className="flex flex-col justify-between rounded-xl p-4 text-white mx-2 cursor-pointer transform transition-transform duration-200 hover:scale-105"
      style={{ width: "220px", height: "180px", backgroundColor: bgColor }}
      onClick={handleClick}
    >
      <div className="flex items-start">
        <div className="flex items-center justify-center bg-white text-[#FF6C9C] rounded-lg p-2 w-12 h-12 text-2xl font-bold">
          {new Date(event.startDate).getDate()}
        </div>
        <div className="flex flex-col ml-2">
          <Tooltip title={event?.title}>
            <span className="text-lg font-semibold">
              {truncateText(event?.title, 15)}
            </span>
          </Tooltip>
          <div className="flex items-center  gap-1">
            <MdAccessTime className=" text-white text-md" />
            <span className="text-white  text-sm">{event?.time}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col text-white font-inter text-sm font-semibold leading-[1.5] capitalize">
        <Tooltip title={event?.description}>  <span>{truncateText(event?.description, 25)}</span></Tooltip>
        
        <span>{formatDate(event?.startDate)}</span>
      </div>
    </div>
  );
};

export default EventCard;
