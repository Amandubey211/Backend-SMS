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

const NoticeCard = ({
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
    <div className="w-full py-3 pr-3  mt-2 border-t border-gray-300 flex">
      {/* Left Icon */}
      <div className="pr-3 flex-shrink-0">
        <div
          className="h-14 w-14 rounded-md flex items-center justify-center"
          style={{ backgroundColor }}
        >
          <img src={image} alt="icon" className="h-10 w-10 object-contain" />
        </div>
      </div>

      <div className="flex flex-col justify-between flex-grow">
        <div>
          <div className="flex items-start justify-between">
            <h2 className="text-base font-semibold text-gray-700 capitalize m-0 leading-5">
              {truncatedTitle}
            </h2>

            {/* Priority Label */}
            <span
              className={`px-1  text-xs font-semibold rounded self-start ${priorityClasses[priority]}`}
            >
              {priority}
            </span>
          </div>

          <div className="flex items-center gap-1 text-gray-500 ">
            <p className="text-xs m-0 leading-4">
              Posted by {authorName || "-"} ({date})
            </p>
          </div>

          {/* Content Snippet */}
          <div className="flex items-center gap-1 text-gray-500 ">
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

export default NoticeCard;
