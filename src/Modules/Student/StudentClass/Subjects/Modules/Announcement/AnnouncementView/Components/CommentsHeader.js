import React from "react";
import { FaSearch } from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";

const CommentsHeader = ({ handleSearch, handleRefresh }) => {
  return (
    <div className="flex items-center gap-2 p-4 bg-white w-full border-b h-full">
      <div className="relative flex items-center w-full max-w-xs">
        <input
          type="text"
          placeholder="Search Entries student"
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full py-2 pl-4 pr-10 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <FaSearch className="absolute right-3 text-gray-500" />
      </div>
      <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
        Unread
      </button>
      <button
        onClick={handleRefresh}
        className="absolute top-12 right-12 text-gray-600 rounded-full p-2 focus:outline-none transform transition-transform duration-300 hover:rotate-180"
        aria-label="Refresh discussion"
      >
        <FiRefreshCw size={24} />
      </button>
    </div>
  );
};

export default CommentsHeader;
