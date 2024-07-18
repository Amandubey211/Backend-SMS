import React from "react";
import { IoCalendarOutline } from "react-icons/io5";
import { format } from "date-fns";

const priorityClasses = {
  "High priority": "bg-pink-100 text-pink-700",
  "Low priority": "bg-gray-100 text-black",
};

const Notice = ({ title, startDate, endDate, priority, content, image }) => {
  // Format dates using date-fns
  const formattedStartDate = format(new Date(startDate), 'yyyy-MM-dd');
  const formattedEndDate = format(new Date(endDate), 'yyyy-MM-dd');

  // Function to render either an image or a fallback emoji inside a circle
  const renderImageOrEmoji = (image) => {
    if (image) {
      return <img src={image} alt="Notice" className="h-16 rounded-md w-16" />;
    } else {
      // Return a styled div with an emoji
      return (
        <div className="flex justify-center items-center h-16 w-16 rounded-[10px] bg-gray-300">
          <span role="img" aria-label="Notice" className="text-xl">📢</span>
        </div>
      );
    }
  };

  return (
    <div className="p-4 border-t bg-white">
      <div className="flex gap-2 items-center mb-2">
        <div className="mr-2">
          {renderImageOrEmoji(image)}
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <div className="flex items-center gap-4 mb-2">
            <div className="flex gap-1 items-center">
              <IoCalendarOutline />
              <span className="text-gray-500">
                {formattedStartDate} - {formattedEndDate}
              </span>
            </div>
            <span
              className={`px-2 py-1 text-xs font-medium rounded ${priorityClasses[priority]}`}
            >
              {priority}
            </span>
          </div>
        </div>
      </div>

      <p className="text-gray-600">{content}</p>
    </div>
  );
};

export default Notice;
