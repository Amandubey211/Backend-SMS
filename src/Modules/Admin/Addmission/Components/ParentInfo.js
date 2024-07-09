// src/components/ParentInfo.js

import React from "react";

const ParentInfo = ({ studentInfo, handleInputChange }) => {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Parent Information</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700">Father Name</label>
          <input
            type="text"
            name="fatherName"
            className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={studentInfo.fatherName}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block text-gray-700">Mother Name</label>
          <input
            type="text"
            name="motherName"
            className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={studentInfo.motherName}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="parentEmail"
            className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={studentInfo.parentEmail}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block text-gray-700">Phone</label>
          <input
            type="tel"
            name="parentPhone"
            className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={studentInfo.parentPhone}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ParentInfo;
