import React from "react";
import { CiSearch } from "react-icons/ci";

function Header({ data, searchQuery, setSearchQuery }) {
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  return (
    <div className="bg-white pl-5 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gradient">
          Offline Exams
          <span className="border rounded-full text-sm p-1 px-2 ml-1 text-gray-500">
            {data?.length}
          </span>
        </h2>
        <div className="relative flex items-center max-w-xs w-full mr-4">
          <input
            type="text"
            placeholder="Search here"
            value={searchQuery}
            onChange={handleSearchChange}
            className="px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 w-full"
          />
          <button className="absolute right-3">
            <CiSearch className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;
