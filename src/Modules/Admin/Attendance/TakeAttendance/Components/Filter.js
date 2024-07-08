import React from "react";

const Filters = () => {
  return (
    <div className="flex justify-between space-x-4 my-4">
      <div className="flex flex-col">
        <label className="text-gray-600 mb-1">Class</label>
        <select className="border rounded p-2 w-56">
          <option>Select Month</option>
        </select>
      </div>
      <div className="flex flex-col">
        <label className="text-gray-600 mb-1">Section</label>
        <select className="border rounded p-2 w-56">
          <option>Select Month</option>
        </select>
      </div>
      <div className="flex flex-col">
        <label className="text-gray-600 mb-1">Group</label>
        <select className="border rounded p-2 w-56">
          <option>Select Month</option>
        </select>
      </div>
    </div>
  );
};

export default Filters;
