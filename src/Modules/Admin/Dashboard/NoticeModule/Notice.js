import React from "react";

const priorityClasses = {
  "Low Priority": "bg-pink-100 text-pink-700",
  "High Priority": "bg-purple-100 text-purple-700",
};

const Notice = ({ title, date, priority, content, image }) => {
  return (
    <div className="p-4 mb-4 rounded-lg shadow-md bg-white">
      <div className="flex items-center mb-2">
        <div className="mr-2">
          <img src={image} alt="icon" className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-500">
          <i className="far fa-calendar-alt mr-1"></i>
          {date}
        </span>
        <span
          className={`px-2 py-1 text-xs font-medium rounded ${priorityClasses[priority]}`}
        >
          {priority}
        </span>
      </div>
      <p className="text-gray-600">{content}</p>
    </div>
  );
};

export default Notice;
