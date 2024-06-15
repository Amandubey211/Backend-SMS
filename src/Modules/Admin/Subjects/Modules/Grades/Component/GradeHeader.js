import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { VscSettings } from "react-icons/vsc";

const GradeHeader = ({ onSearch, onFilterChange }) => {
  const [search, setSearch] = useState("");

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    onSearch(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  return (
    <div className="p-2 bg-white ">
      <h2 className="text-2xl font-semibold mb-3">All Grades</h2>
      <div className="flex  items-end justify-around   gap-1 ">
        <div className="relative flex flex-col">
          <label className="text-gray-600 mb-1">Search Student</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 w-60"
              value={search}
              onChange={handleSearchChange}
            />
            <button className="absolute right-2 top-2">
              <CiSearch className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-600 mb-1">Section</label>
          <select
            name="section"
            className="px-4 py-2 border w-44 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            onChange={handleFilterChange}
          >
            <option value="">All Sections</option>
            <option value="Section A">Section A</option>
            <option value="Section B">Section B</option>
            <option value="Section C">Section C</option>
            <option value="Section D">Section D</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-600 mb-1">Group</label>
          <select
            name="group"
            className="px-4 py-2 border w-44 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            onChange={handleFilterChange}
          >
            <option value="">All Groups</option>
            <option value="Business Group">Business Group</option>
            <option value="Science Group">Science Group</option>
            <option value="Arts Group">Arts Group</option>
            <option value="Math Group">Math Group</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-600 mb-1">Assignment</label>
          <select
            name="assignment"
            className="px-4 py-2 border w-44 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            onChange={handleFilterChange}
          >
            <option value="">All Assignments</option>
            <option value="400 / 6">400 / 6</option>
            <option value="380 / 6">380 / 6</option>
            <option value="350 / 6">350 / 6</option>
            <option value="370 / 6">370 / 6</option>
            <option value="410 / 6">410 / 6</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-600 mb-1">Quizzes</label>
          <select
            name="quizzes"
            className="px-4 py-2 border w-44 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            onChange={handleFilterChange}
          >
            <option value="">All Quizzes</option>
            <option value="400 / 6">400 / 6</option>
            <option value="390 / 6">390 / 6</option>
            <option value="360 / 6">360 / 6</option>
            <option value="380 / 6">380 / 6</option>
            <option value="420 / 6">420 / 6</option>
          </select>
        </div>
        <button className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300">
          <VscSettings className="w-5 h-5 text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default GradeHeader;
