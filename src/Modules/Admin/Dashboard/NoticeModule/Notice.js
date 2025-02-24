import React from "react";
import { Tooltip, Tag } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { IoCalendarOutline } from "react-icons/io5";
import { CiBookmarkCheck } from "react-icons/ci";

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
  date,
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

      {/* Card Content (flex-col + space-between) */}
      <div className="flex flex-col justify-between flex-grow">
        {/* Upper Section: Title & Priority */}
        <div>
          <div className="flex items-start justify-between">
            {/* Title (truncated with Tooltip) */}
            <Tooltip title={title}>
              <h2 className="text-base font-semibold text-gray-700 capitalize m-0 leading-5">
                {truncatedTitle}
              </h2>
            </Tooltip>

            {/* Priority Label */}
            <span
              className={`px-2 pt-[2px] text-xs font-medium rounded self-start ${priorityClasses[priority]}`}
            >
              {priority}
            </span>
          </div>

          {/* Single badge below the title containing author & date */}
          <div className="mt-1">
            <Tag
              color="blue"
              className="inline-flex items-center text-xs"
              style={{ width: "auto" }} // ensures it doesn't stretch full width
            >
              {/* user icon + posted by */}
              <UserOutlined />
              <span className="mx-1">Posted by {authorName || "-"}</span>
              {/* date with calendar icon */}
              <IoCalendarOutline className="mx-1" />
              <span>{date}</span>
            </Tag>
          </div>

          {/* Content Snippet */}
          <div className="flex items-center gap-1 text-gray-500 mt-2">
            <CiBookmarkCheck size={15} />
            <p className="text-xs m-0 leading-4">
              {truncateText(
                content,
                descriptionLength?.descriptionLength || 100
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notice;
