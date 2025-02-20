import React from "react";
import { AiOutlineFileText } from "react-icons/ai";
import { CiBookmarkCheck } from "react-icons/ci";
import { IoCalendarOutline } from "react-icons/io5";
import { TbCheck, TbFileDescription } from "react-icons/tb";
import { TiMessageTyping } from "react-icons/ti";
const priorityClasses = {
  "High priority": "bg-pink-100 text-pink-700",
  "Low priority": "bg-gray-100 text-black",
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
  const truncateText = (text, maxLength) => {
    return text?.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };
  return (
    <div className="w-[97%] p-4 my-4 border-t flex shadow-md border rounded-lg">
      <div className="pr-4 flex-shrink-0">
        <div
          className="h-16 w-16 rounded-md flex items-center justify-center"
          style={{ backgroundColor }}
        >
          <img src={image} alt="icon" className="h-12 w-12 object-contain" />
        </div>
      </div>
      <div></div>
      <div className="flex flex-col gap-1  flex-grow">
        <div className="flex justify-between align-top">
          <h2 className="text-lg font-semibold text-gray-700 capitalize">
            {title}{" "}
            <span className="ml-2 text-sm text-gray-700">
              (Posted by{" "}
              <span className="text-sm text-gray-700 capitalize">
                {authorName || "-"}
              </span>
              )
            </span>
          </h2>
          <span
            className={`px-2 pt-1 text-xs font-medium rounded ${priorityClasses[priority]}`}
          >
            {priority}
          </span>
        </div>

        <div className="flex items-center gap-4 ">
          <div className="flex gap-1 items-center text-gray-500">
            <IoCalendarOutline size={15} />
            <span className="text-gray-500 text-sm">{date}</span>
          </div>
          {/* <span
            className={`px-2 text-xs font-medium rounded ${priorityClasses[priority]}`}
          >
            {priority}
          </span> */}
        </div>
        <div className="flex gap-1  text-gray-500">
          <CiBookmarkCheck size={17} />
          <p className="text-gray-500 text-sm capitalize">
            {truncateText(content, descriptionLength.descriptionLength)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Notice;
