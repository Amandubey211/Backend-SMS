import React from "react";
import { AiOutlinePrinter } from "react-icons/ai";
import {toast} from "react-hot-toast"
const StudentGradeModalFilterHeader = ({ filters, onFilterChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  return (
    <div className="flex items-end gap-4 p-4 bg-white w-full">
      <div className="flex flex-col flex-grow">
        <label className="text-sm font-medium text-gray-700">Arrange By</label>
        <select
          name="arrangeBy"
          value={filters.arrangeBy}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select</option>
          <option value="Assignment">Assignment</option>
          <option value="Group Assignment">Group Assignment</option>
          <option value="Quiz">Quiz</option>
          <option value="Group Quiz">Group Quiz</option>
        </select>
      </div>
      <div className="flex flex-col flex-grow">
        <label className="text-sm font-medium text-gray-700">Modules</label>
        <select
          name="module"
          value={filters.module}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select</option>
          <option value="Module 1">Module 1</option>
          <option value="Module 2">Module 2</option>
          <option value="Module 3">Module 3</option>  <option value="Module 4">Module 4</option>
        </select>
      </div>
      <div className="flex flex-col flex-grow">
        <label className="text-sm font-medium text-gray-700">Chapter</label>
        <select
          name="chapter"
          value={filters.chapter}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select</option>
          <option value="Chapter 1">Chapter 1</option>
          <option value="Chapter 2">Chapter 2</option>
          <option value="Chapter 3">Chapter 3</option>
          <option value="Chapter 4">Chapter 4</option>
        </select>
      </div>
      <div className="flex flex-col flex-grow">
        <label className="text-sm font-medium text-gray-700">Status</label>
        <select
          name="status"
          value={filters.status}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select</option>
          <option value="Submit">Submit</option>
          <option value="Excused">Excused</option>
          <option value="Missing">Missing</option>
        </select>
      </div>
      <button onClick={()=>toast.success("Backend Yet to Add")} className="p-2 bg-purple-100 rounded-md">
        <AiOutlinePrinter className="text-purple-600" size={24} />
      </button>
    </div>
  );
};

export default StudentGradeModalFilterHeader;
