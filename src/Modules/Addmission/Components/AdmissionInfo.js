// src/components/AdmissionInfo.js

import React from "react";

const AdmissionInfo = ({ studentInfo, handleInputChange }) => {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Admission to Class</h2>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-gray-700">Class</label>
          <select
            name="class"
            className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={studentInfo.class}
            onChange={handleInputChange}
          >
            <option>Class - 1</option>
            <option>Class - 2</option>
            <option>Class - 3</option>
            <option>Class - 4</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700">Section</label>
          <select
            name="section"
            className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={studentInfo.section}
            onChange={handleInputChange}
          >
            <option>A</option>
            <option>B</option>
            <option>C</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700">Session</label>
          <input
            type="text"
            name="session"
            className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={studentInfo.session}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block text-gray-700">Admission Fee</label>
          <input
            type="text"
            name="admissionFee"
            className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={studentInfo.admissionFee}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block text-gray-700">Status</label>
          <select
            name="status"
            className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={studentInfo.status}
            onChange={handleInputChange}
          >
            <option>Paid</option>
            <option>Unpaid</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AdmissionInfo;
