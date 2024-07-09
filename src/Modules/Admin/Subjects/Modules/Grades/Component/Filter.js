import React from "react";
import toast from "react-hot-toast";

const Filter = ({ onFilterChange, onClose }) => {
  return (
    <div className="flex flex-col h-full p-2">
      <div className="flex flex-col mb-4">
        <label className="text-gray-600 mb-1">Section</label>
        <select
          name="section"
          className="px-4 py-2 border w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          onChange={(e) => onFilterChange("section", e.target.value)}
        >
          <option value="">Select</option>
          <option value="Section A">Section A</option>
          <option value="Section B">Section B</option>
          <option value="Section C">Section C</option>
          <option value="Section D">Section D</option>
        </select>
      </div>
      <div className="flex flex-col mb-4">
        <label className="text-gray-600 mb-1">Modules</label>
        <select
          name="modules"
          className="px-4 py-2 border w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          onChange={(e) => onFilterChange("modules", e.target.value)}
        >
          <option value="">Select</option>
          <option value="Module 1">Module 1</option>
          <option value="Module 2">Module 2</option>
        </select>
      </div>
      <div className="flex flex-col mb-4">
        <label className="text-gray-600 mb-1">Student Group</label>
        <select
          name="group"
          className="px-4 py-2 border w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          onChange={(e) => onFilterChange("group", e.target.value)}
        >
          <option value="">Select</option>
          <option value="Business Group">Business Group</option>
          <option value="Science Group">Science Group</option>
          <option value="Arts Group">Arts Group</option>
          <option value="Math Group">Math Group</option>
        </select>
      </div>
      <div className="mt-auto mb-6">
        <button
          onClick={() => {
            toast.success("Filter applied");
            onClose();
          }}
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
        >
          Filter
        </button>
      </div>
    </div>
  );
};

export default Filter;
