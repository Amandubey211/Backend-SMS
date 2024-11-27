import React from "react";
import { IoCalendarOutline } from "react-icons/io5";
import { format } from "date-fns";
import icon1 from "../../../../Assets/DashboardAssets/Images/image1.png";

const priorityClasses = {
  "High priority": "bg-pink-100 text-pink-700",
  "Low priority": "bg-gray-100 text-black",
};

const Notice = ({ title, startDate, endDate, priority, content, image, backgroundColor, authorName }) => {
  // Format dates using date-fns with optional chaining
  const formattedStartDate = startDate ? format(new Date(startDate), 'yyyy-MM-dd') : "N/A";
  const formattedEndDate = endDate ? format(new Date(endDate), 'yyyy-MM-dd') : "N/A";

  // Function to render either an image or a fallback image inside a styled div
  const renderImageOrFallback = (image) => {
    return (
      <div
        className="flex justify-center items-center h-16 w-16 rounded-[10px]"
        style={{ background: backgroundColor }}
      >
        <img
          src={image || icon1}
          alt="Notice"
          className="h-12 w-12 rounded-md"
        />
      </div>
    );
  };

  return (
    <div className="p-4 border-t bg-white">
      <div className="flex gap-2 items-center mb-2">
        <div className="mr-2">
          {renderImageOrFallback(image)}
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-gray-800">{title} <span className="ml-4 text-sm text-gray-500">(Posted by <span className="text-sm text-gray-700">{authorName || '-'}</span>)</span></h2>
          <div className="flex items-center gap-4 mb-2">
            <div className="flex gap-1 items-center">
              <IoCalendarOutline />
              <span className="text-gray-500">
                {formattedStartDate} - {formattedEndDate}
              </span>
            </div>
            <span
              className={`px-2 py-1 text-xs font-medium rounded ${priorityClasses[priority] || "bg-gray-100 text-black"}`}
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
