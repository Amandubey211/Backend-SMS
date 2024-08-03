import React from "react";
import { IoCalendarOutline } from "react-icons/io5";
const priorityClasses = {
  "High priority": "bg-pink-100 text-pink-700",
  "Low priority": "bg-gray-100 text-black",
};


const Notice = ({ title, date, priority, content, image, backgroundColor }) => {

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };
  return (
    <div className="p-4 border-t bg-white flex">
      <div className="mr-4 flex-shrink-0">
        <div
          className="h-16 w-16 rounded-md flex items-center justify-center"
          style={{ backgroundColor }}
        >
          <img src={image} alt="icon" className="h-8 w-8 object-contain" />
        </div>
      </div>
      <div className="flex flex-col gap-1 flex-grow">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <div className="flex items-center gap-4 mb-2">
          <div className="flex gap-1 items-center">
            <IoCalendarOutline />
            <span className="text-gray-500">{date}</span>
          </div>
          <span
            className={`px-2 py-1 text-xs font-medium rounded ${priorityClasses[priority]}`}
          >
            {priority}
          </span>
        </div>
        <p className="text-gray-600">{truncateText(content, 50)}</p>
      </div>
    </div>
  );
};

export default Notice;
