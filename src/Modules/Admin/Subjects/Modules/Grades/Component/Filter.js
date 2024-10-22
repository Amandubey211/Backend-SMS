import React from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const Filter = ({ onFilterChange, onClose }) => {
  const classDetails = useSelector((store) => store.admin.class);
  console.log(classDetails);

  return (
    <div className="flex flex-col h-full p-2">
      <div className="flex flex-col mb-4">
        <label className="text-gray-600 mb-1">Section</label>
        <select
          name="section"
          className="px-4 py-2 border w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          onChange={(e) => onFilterChange("section", e.target.value)}
        >
          <option value="">All</option>
          {classDetails?.sections?.map((i) => (
            <>
              <option value={i._id}>{i?.sectionName}</option>
            </>
          ))}
        </select>
      </div>
      <div className="flex flex-col mb-4">
        <label className="text-gray-600 mb-1">Student Group</label>
        <select
          name="group"
          className="px-4 py-2 border w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          onChange={(e) => onFilterChange("group", e.target.value)}
        >
          <option value="">All</option>
          {classDetails?.groups?.map((i) => (
            <>
              <option value={i._id}>{i?.groupName}</option>
            </>
          ))}
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
