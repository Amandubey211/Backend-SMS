import React from "react";
import { MdAccessTime } from "react-icons/md";
import { useDispatch } from "react-redux";
import { setSelectedEvent, setSidebarContent } from "../../../../../Store/Slices/Admin/NoticeBoard/Events/eventSlice";

const colors = ["bg-yellow-300", "bg-blue-300", "bg-green-300"];

// Hash function to generate a numeric index for a string (e.g., studentId)
const hashCode = (str) => {
  let hash = 0;
  if (str.length === 0) return hash;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};


// Function to truncate text safely
const truncateText = (text, maxLength) => {
  return text && text.length > maxLength ? `${text.substring(0, maxLength)}...` : text ?? ('No Description');
};


const EventCard = ({ event }) => {
  const dispatch = useDispatch();

  // Get the time as is from the event object
  const rawTime = event?.time || "No time"; // Default fallback for missing time

  // Assign a random color based on eventId or another unique identifier
  const colorIndex = hashCode(event?._id || "AmanDubey") % colors?.length;
  const color = colors[colorIndex];

  const handleClick = () => {
    dispatch(setSelectedEvent(event)); // Use direct action dispatch
    dispatch(setSidebarContent("viewEvent"));
  };

  return (
    <div
      className={`flex flex-col justify-between rounded-lg p-4 h-48 w-56 text-white shadow-lg m-2 cursor-pointer ${color}  transition`}
      onClick={handleClick}
    >
      <div className="flex items-start">
        <div className="flex items-center justify-center bg-white rounded-lg p-2 w-12 h-12 text-2xl font-bold text-purple-500">
          {event?.date ? new Date(event.date).getDate() : "N/A"}
        </div>
        <div className="flex flex-col ml-2">
          <span className="text-lg font-semibold">{truncateText(event?.title, 10)}</span>
          <div className="flex items-center">
            <MdAccessTime className="mr-2 text-white text-lg" />
            <span className="text-sm font-light">{rawTime}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-2  text-sm font-semibold leading-5">
        <p className="truncate">
          {truncateText(event?.description, 20) || "No description available"}
        </p>
        <span>{event?.date ? new Date(event.date).toLocaleDateString() : "Invalid date"}</span>
      </div>
    </div>
  );
};

export default EventCard;
