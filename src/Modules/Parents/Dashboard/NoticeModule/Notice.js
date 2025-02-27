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
        <div className="flex-1 flex flex-col gap-2">
          {/* Title with Posted By */}
          <h2 className="font-semibold text-lg gap-2">
            {title}
            <span className="ml-4 text-sm text-gray-500">
              (Posted by{" "}
              <span className="text-sm text-gray-700">{authorName || "-"}</span>
              )
            </span>
          </h2>

          {/* Date and Priority Label */}
          <div className="flex items-center text-xs">
            <IoCalendarOutline className="text-gray-400" />
            <span className="ml-2 text-sm text-gray-500">
              {formattedStartDate}
              {formattedEndDate && ` - ${formattedEndDate}`}
            </span>

            {/* Priority Label with inherited styles */}
            <div
              className={`ml-3 px-3 py-1  rounded-full ${priority === "High priority"
                  ? "text-pink-500 bg-pink-100"
                  : "text-gray-500"
                }`}
            >
              {priority}
            </div>
          </div>
        </div>

      </div>

      <p className="text-gray-600">{content}</p>
    </div>
  );
};

export default Notice;
