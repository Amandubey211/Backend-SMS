import React from "react";
import { CiSearch } from "react-icons/ci";
import { VscSettings } from "react-icons/vsc";

const GradeHeader = () => {
  return (
    <div className="p-4 bg-white ">
      <h2 className="text-2xl font-semibold mb-3">All Grades</h2>
      <div className="flex  items-end justify-around ">
        <div className="relative flex flex-col">
          <label className="text-gray-600 mb-1">Search Student</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 w-80"
            />
            <button className="absolute right-2 top-2">
              <CiSearch className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-600 mb-1">Modules</label>
          <select className="px-4 py-2 border w-44 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300">
            <option>Select</option>
            <option>Module 1</option>
            <option>Module 2</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-600 mb-1">Assignment</label>
          <select className="px-4 py-2 border w-44 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300">
            <option>Select</option>
            <option>Assignment 1</option>
            <option>Assignment 2</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-600 mb-1">Quizzes</label>
          <select className="px-4 py-2 border w-44 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300">
            <option>Select</option>
            <option>Quiz 1</option>
            <option>Quiz 2</option>
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
