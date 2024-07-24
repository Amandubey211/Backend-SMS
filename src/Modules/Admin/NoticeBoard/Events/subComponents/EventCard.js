import React from "react";
import { MdAccessTime } from "react-icons/md";
import { format } from "date-fns";

const EventCard = ({ event }) => {
  // Format date and time
  const formattedDate = format(event.startDate, "MMM d, yyyy");
  const formattedTime = format(event.startDate, "hh:mm a");
  const formattedDescription = event.description || "No description available";

  return (
    <div className="h-full w-full  flex flex-col border rounded-lg shadow-lg text-white bg-[#FF6C9C] border-black">
      <div className="flex items-center p-4 gap-4">
        <div className="flex flex-col items-center justify-center border rounded p-3 bg-[#F9FAFC]">
          <span className="text-3xl font-semibold text-[#FF6C9C]">
            {format(event.startDate, "d")}
          </span>
        </div>

        <div className="flex flex-col justify-start">
          <span className="text-lg font-medium">{event.title}</span>
          <div className="flex items-center mt-2">
            <MdAccessTime className="text-white text-xl mr-2" />
            <span className="text-sm font-light">{formattedTime}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col px-6 py-[8px] text-[#F9FAFC] font-light ">
        <span className="mb-2">{formattedDescription}</span>
        <span className="text-sm">{formattedDate}</span>
      </div>
    </div>
  );
};

export default EventCard;
