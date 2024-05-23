import React from "react";

const Notice = ({ notice }) => {
  const priorityColors = {
    High: "bg-pink-100 text-pink-800",
    Medium: "bg-yellow-100 text-yellow-800",
    Low: "bg-purple-100 text-purple-800",
  };

  return (
    <div className="flex items-start p-4 bg-white border border-gray-200 rounded-lg mb-4 shadow-sm">
      <img
        src={notice.image}
        alt="Notice Icon"
        className="w-12 h-12 rounded-full mr-4"
      />
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            {notice.title}
          </h3>
          <span
            className={`px-2 py-1 text-xs font-semibold rounded ${
              priorityColors[notice.priority]
            }`}
          >
            {notice.priority} Priority
          </span>
        </div>
        <div className="text-sm text-gray-500 flex items-center mt-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M6 2a1 1 0 00-1 1v1a1 1 0 11-2 0V3a3 3 0 013-3h8a3 3 0 013 3v1a1 1 0 11-2 0V3a1 1 0 00-1-1H6zM5 7a3 3 0 00-3 3v7a3 3 0 003 3h10a3 3 0 003-3v-7a3 3 0 00-3-3H5zm-1 3a1 1 0 011-1h10a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1v-7z"
              clipRule="evenodd"
            />
          </svg>
          {notice.date}
        </div>
        <p className="text-gray-700 mt-2">{notice.description}</p>
      </div>
    </div>
  );
};

export default Notice;
