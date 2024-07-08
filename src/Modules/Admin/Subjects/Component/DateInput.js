import React from 'react';

const DateInput = ({ label, name, value, handleChange }) => (
  <>
    <label className="block mb-2 text-sm font-medium text-gray-700">{label}</label>
    <input
      type="date"
      name={name}
      value={value}
      onChange={handleChange}
      className="mb-4 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </>
);

export default DateInput;