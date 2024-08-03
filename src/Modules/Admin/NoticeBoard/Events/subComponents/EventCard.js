import React from "react";
import { MdAccessTime } from "react-icons/md";
import { format, parse } from "date-fns";

const EventCard = ({ event, color, onClick }) => {
  // Format date
  const formattedDate = format(new Date(event.startDate), "MMM d, yyyy");

  // Parse and format the time
  let formattedTime = "Invalid time";
  try {
    if (event.time) {
      // Attempt to parse the time from a 24-hour format
      const [hours, minutes] = event.time.split(":");
      const parsedTime = new Date();
      parsedTime.setHours(parseInt(hours), parseInt(minutes));

      // Format it to 12-hour format with AM/PM
      formattedTime = format(parsedTime, "hh:mm a");
    } else {
      // Fallback if event.time is not provided, use startDate
      formattedTime = format(new Date(event.startDate), "hh:mm a");
    }
  } catch (error) {
    console.error("Error formatting time:", error, event.time);
  }

  const formattedDescription = event.description || "No description available";

  return (
    <div
      className="flex flex-col justify-between rounded-xl p-4 text-white shadow-lg m-2 cursor-pointer"
      style={{ backgroundColor: color, width: "220px", height: "180px" }}
      onClick={() => onClick(event)}
    >
      <div className="flex items-start">
        <div
          className="flex items-center justify-center bg-white rounded-lg p-2 w-12 h-12 text-2xl font-bold"
          style={{ color }}
        >
          {format(new Date(event.startDate), "d")}
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
