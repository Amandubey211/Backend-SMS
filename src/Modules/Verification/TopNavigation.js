// src/components/TopNavigation.js

import React from "react";
import { CiSearch } from "react-icons/ci";

const TopNavigation = ({
  activeTab,
  setActiveTab,
  searchQuery,
  handleSearchChange,
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex gap-2 items-center">
        <h1
          className={`text-xl font-semibold p-1 border rounded-2xl px-4 cursor-pointer transition-all duration-300 ${
            activeTab === "unverified"
              ? "text-purple-500  bg-purple-100"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => setActiveTab("unverified")}
        >
          Unverified Students
        </h1>
        <h1
          className={`text-xl font-semibold p-1 border rounded-2xl px-4 cursor-pointer transition-all duration-300 ${
            activeTab === "rejected"
              ? "text-purple-500 bg-purple-100"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => setActiveTab("rejected")}
        >
          Rejected Students
        </h1>
      </div>

      <div className="relative flex items-center max-w-xs w-full mr-4">
        <input
          type="text"
          placeholder="Search By Email"
          value={searchQuery}
          onChange={handleSearchChange}
          className="px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 w-full transition-all duration-300"
        />
        <button className="absolute right-3">
          <CiSearch className="w-5 h-5 text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default TopNavigation;
