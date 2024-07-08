import React from "react";
import { IoCalendarOutline } from "react-icons/io5";

const priorityClasses = {
  "High Priority": "bg-pink-100 text-pink-700",
  "Low Priority": "bg-gray-100 text-black",
};

const Notice = ({ title, date, priority, content, image }) => {
  return (
    <div className="p-4 border-t  bg-white">
      <div className="flex gap-2 items-center mb-2">
        <div className="mr-2 ">
          <img src={image} alt="icon" className="h-16 rounded-md w-16" />
        </div>
        <div className="flex flex-col gap-1 ">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <div className="flex items-center gap-4 mb-2">
            <div className="flex gap-1 items-center">
            <IoCalendarOutline/>
            <span className="text-gray-500">
        
              {date}
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
