import React from 'react';

const AssignToRadios = ({ assignTo, handleChange }) => (
  <div className="flex items-center mb-4">
    <input
      type="radio"
      name="assignTo"
      value="everyone"
      checked={assignTo === "everyone"}
      onChange={handleChange}
      className="mr-2 focus:ring-blue-500"
    />
    <label className="text-sm font-medium text-gray-700">Everyone</label>
    <input
      type="radio"
      name="assignTo"
      value="section"
      checked={assignTo === "section"}
      onChange={handleChange}
      className="ml-4 mr-2 focus:ring-blue-500"
    />
    <label className="text-sm font-medium text-gray-700">Section</label>
    <input
      type="radio"
      name="assignTo"
      value="group"
      checked={assignTo === "group"}
      onChange={handleChange}
      className="ml-4 mr-2 focus:ring-blue-500"
    />
    <label className="text-sm font-medium text-gray-700">Group</label>
  </div>
);

export default AssignToRadios;