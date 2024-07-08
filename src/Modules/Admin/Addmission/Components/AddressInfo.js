// src/components/AddressInfo.js

import React from "react";

const AddressInfo = ({ studentInfo, handleInputChange }) => {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Address</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700">Phone</label>
          <input
            type="text"
            placeholder="000-000-0000"
            name="phone"
            className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={studentInfo.phone}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block text-gray-700">Email</label>
          <input
            type="text"
            name="email"
            placeholder="studentdiwan@gmail.com"
            className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={studentInfo.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-span-2">
          <label className="block text-gray-700">Address</label>
          <input
            type="text"
            name="address"
            className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={studentInfo.address}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );
};

export default AddressInfo;
