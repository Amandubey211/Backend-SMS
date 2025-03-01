import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { NavLink } from "react-router-dom";

const AnnouncementHeader = ({ onSearch }) => {
  const [filter, setFilter] = useState("all");

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleSearchChange = (event) => {
    onSearch(event.target.value);
  };

  return (
    <div className=" pb-4">
      <div className="flex justify-between items-center ">
        <h2 className="text-xl font-semibold mb-4">All Announcement</h2>
      </div>
      <div className="flex items-center justify-between pe-9 mt-3">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Search here"
            className="px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 w-80"
            onChange={handleSearchChange}
          />
          <button className="absolute right-3">
            <CiSearch className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-500">Status : </span>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="filter"
              value="all"
              checked={filter === "all"}
              onChange={handleFilterChange}
              className="custom-radio"
            />
            <span className="ml-2">All</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="filter"
              value="unread"
              checked={filter === "unread"}
              onChange={handleFilterChange}
              className="custom-radio"
            />
            <span className="ml-2">Unread</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementHeader;
