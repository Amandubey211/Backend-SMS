import React from "react";
import { format } from "date-fns"; // Importing date-fns for date formatting

const DateInput = ({ label, name, value, handleChange }) => {
  // Ensure the value is in 'yyyy-MM-dd' format or empty
  const formattedValue = value ? format(new Date(value), "yyyy-MM-dd") : "";

  return (
    <>
      <label className="block mb-2 text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type="date"
        name={name}
        value={formattedValue} // Use the formatted date value
        onChange={handleChange}
        className="mb-4 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </>
  );
};

export default DateInput;
