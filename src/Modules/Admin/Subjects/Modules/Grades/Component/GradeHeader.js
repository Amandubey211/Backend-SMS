import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { VscSettings } from "react-icons/vsc";
import Sidebar from "../../../../../../Components/Common/Sidebar";
import Filter from "./Filter";

const GradeHeader = ({ onSearch, onFilterChange }) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    onSearch(e.target.value);
  };

  const handleFilterChange = (name, value) => {
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
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 w-64"
              value={search}
              onChange={handleSearchChange}
            />
            <button className="absolute right-2 top-3">
              <CiSearch className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-600 mb-1">Module</label>
          <select
            name="section"
            className="px-4 py-2 border w-40 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            onChange={(e) => handleFilterChange("section", e.target.value)}
          >
            <option value="">Select</option>
            <option value="Section A">Module 1</option>
            <option value="Section B">Module 2</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-600 mb-1">Group</label>
          <select
            name="group"
            className="px-4 py-2 border w-40 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            onChange={(e) => handleFilterChange("group", e.target.value)}
          >
            <option value="">Select</option>
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
            className="px-4 py-2 border w-40 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            onChange={(e) => handleFilterChange("assignment", e.target.value)}
          >
            <option value="">Select</option>
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
            className="px-4 py-2 border w-40 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            onChange={(e) => handleFilterChange("quizzes", e.target.value)}
          >
            <option value="">
              <span className="opacity-40 text-gray-500"> Select</span>
            </option>
            <option value="400 / 6">400 / 6</option>
            <option value="390 / 6">390 / 6</option>
            <option value="360 / 6">360 / 6</option>
            <option value="380 / 6">380 / 6</option>
            <option value="420 / 6">420 / 6</option>
          </select>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <VscSettings className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      <Sidebar title="Filter" isOpen={open} onClose={() => setOpen(!open)}>
        <Filter onFilterChange={handleFilterChange} onClose={() => setOpen(!open)} />
      </Sidebar>
    </div>
  );
};

export default GradeHeader;
