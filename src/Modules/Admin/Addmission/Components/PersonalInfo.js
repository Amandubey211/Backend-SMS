// src/components/PersonalInfo.js

import React from "react";

const PersonalInfo = ({ studentInfo, handleInputChange }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          value={studentInfo.name}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label className="block text-gray-700">Student ID</label>
        <input
          type="text"
          name="studentId"
          className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          value={studentInfo.studentId}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label className="block text-gray-700">Date of Birth</label>
        <input
          type="date"
          name="dateOfBirth"
          className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          value={studentInfo.dateOfBirth}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label className="block text-gray-700">Gender</label>
        <select
          name="gender"
          className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          value={studentInfo.gender}
          onChange={handleInputChange}
        >
          <option value="">Choose Options</option>
          <option>Male</option>
          <option>Female</option>
          <option>Trans</option>
          <option>Other</option>
        </select>
      </div>
      <div>
        <label className="block text-gray-700">Religion</label>
        <select
          name="religion"
          className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          value={studentInfo.religion}
          onChange={handleInputChange}
        >
          <option value="">Choose Options</option>
          <option>Islam</option>
          <option>Christianity</option>
          <option>Hinduism</option>
          <option>Buddhism</option>
        </select>
      </div>
      <div>
        <label className="block text-gray-700">Blood Group</label>
        <select
          name="bloodGroup"
          className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          value={studentInfo.bloodGroup}
          onChange={handleInputChange}
        >
          <option value="">Choose Options</option>
          <option>0+</option>
          <option>0-</option>
          <option>A+</option>
          <option>A-</option>
          <option>B+</option>
          <option>B-</option>
          <option>AB+</option>
          <option>AB-</option>
        </select>
      </div>
    </div>
  );
};

export default PersonalInfo;
