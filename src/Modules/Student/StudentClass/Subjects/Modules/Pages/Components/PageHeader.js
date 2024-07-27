import { RiSearchLine } from "react-icons/ri";
import React from "react";

const PageHeader = ({ searchQuery, handleSearchChange }) => {
  return (
    <div className="flex items-center justify-between w-full p-4 bg-white border-gray-300">
      <h1 className="text-lg font-semibold text-gray-800">All Pages</h1>
      <div className="flex items-center space-x-4">
        <div className="relative flex items-center w-80">
          <input
            type="text"
            placeholder="Search by Title or Author"
            value={searchQuery}
            onChange={handleSearchChange}
            className="px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 w-full"
          />
          <button className="absolute right-3">
            <RiSearchLine className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
