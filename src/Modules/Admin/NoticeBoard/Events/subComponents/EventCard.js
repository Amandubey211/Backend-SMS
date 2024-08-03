import React from "react";
import { MdAccessTime } from "react-icons/md";
import { format } from "date-fns";

const EventCard = ({ event, onClick }) => {
  // Format date and time
  const formattedDate = format(event.startDate, "MMM d, yyyy");
  const formattedTime = format(event.startDate, "hh:mm a");
  const formattedDescription = event.description || "No description available";

  // Define an array of background colors
  const bgColors = [
    "#FF6C9C", // pink
    "#E24DFF", // purple
    "#21AEE7", // blue
    "#FBB778", // orange
  ];

  // Determine the background color based on the event ID
  const eventId = event.id ?? 0;
  const bgColor = bgColors[eventId % bgColors.length];

  return (
    <div
      className="flex flex-col justify-between rounded-xl p-4 text-white shadow-lg m-2 cursor-pointer"
      style={{ backgroundColor: bgColor, width: "220px", height: "180px" }}
      onClick={() => onClick(event)}
    >
      <div className="flex items-start">
        <div
          className="flex items-center justify-center bg-white rounded-lg p-2 w-12 h-12 text-2xl font-bold"
          style={{ color: bgColor }}
        >
          {format(event.startDate, "d")}
        </div>

        <div className="flex flex-col ml-2">
          <span className="text-lg font-semibold">{event.title}</span>
          <div className="flex items-center">
            <MdAccessTime className="mr-2 text-white text-lg" />
            <span className="text-sm font-light">{formattedTime}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-2 font-inter text-sm font-semibold leading-[1.5]">
        <span>{formattedDescription}</span>
        <span>{formattedDate}</span>
      </div>
    </div>
  );
};

export default EventCard;
