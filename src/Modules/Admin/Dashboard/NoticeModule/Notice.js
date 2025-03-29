import React from "react";
import { Tooltip, Tag } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { IoCalendarOutline } from "react-icons/io5";

// Priority style classes
const priorityClasses = {
  "High priority": "bg-pink-100 text-pink-700",
  "Low priority": "bg-gray-100 text-black",
};

// Helper to truncate text
const truncateText = (text, maxLength) => {
  if (!text) return "";
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

const Notice = ({
  title,
  startdate,
  enddate, // Destructure the new end date prop
  priority,
  content,
  image,
  backgroundColor,
  descriptionLength,
  authorName,
}) => {
  // Limit title display; show full title in Tooltip on hover
  const maxTitleLength = 30; // Customize as desired
  const truncatedTitle = truncateText(title, maxTitleLength);

  return (
    <div className="w-[97%] p-3 my-3 border shadow-md border-gray-200 rounded-lg flex min-h-[80px]">
      {/* Left Icon */}
      <div className="pr-3 flex-shrink-0">
        <div
          className="h-14 w-14 rounded-md flex items-center justify-center"
          style={{ backgroundColor }}
        >
          <img src={image} alt="icon" className="h-10 w-10 object-contain" />
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-col justify-between flex-grow">
        <div>
          {/* Upper Section: Title & Priority */}
          <div className="flex items-start justify-between">
            <Tooltip title={title}>
              <h2 className="text-base font-semibold text-gray-700 capitalize m-0 leading-5">
                {truncatedTitle}
              </h2>
            </Tooltip>
            <span
              className={`px-2 pt-[2px] text-xs font-medium rounded self-start ${priorityClasses[priority]}`}
            >
              {priority}
            </span>
          </div>

          {/* Date Tag (showing start and end dates) */}
          <div className="mt-1">
            <Tag
              color="blue"
              className="inline-flex items-center text-xs"
              style={{ width: "auto" }}
            >
              <IoCalendarOutline className="mx-1" />
              <span>{startdate}</span>
              <span className="mx-1">to</span>
              <IoCalendarOutline className="mx-1" />
              <span>{enddate}</span>
            </Tag>
          </div>
        </div>

        {/* Posted by info at the bottom right */}
        <div className="flex justify-start mt-2">
          <span className="text-xs text-gray-600">
            <UserOutlined className="mr-1" />
            Posted by {authorName || "-"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Notice;
