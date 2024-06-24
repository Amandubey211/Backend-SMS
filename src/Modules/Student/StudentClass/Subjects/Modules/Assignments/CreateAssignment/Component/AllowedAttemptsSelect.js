import React from 'react';

const AllowedAttemptsSelect = ({ allowedAttempts, handleChange }) => (
  <>
    <label className="block mb-2 text-sm font-medium text-gray-700">Allowed Attempts</label>
    <select
      name="allowedAttempts"
      value={allowedAttempts}
      onChange={handleChange}
      className="mb-4 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Select</option>
      <option value="limited">Limited</option>
      <option value="unlimited">Unlimited</option>
    </select>
  </>
);

export default AllowedAttemptsSelect;