import React from "react";

const NumberOfAttemptsInput = ({ numberOfAttempts, handleChange }) => (
  <>
    <label className="block mb-2 text-sm font-medium text-gray-700">
      Number of Attempts
    </label>
    <input
      type="number"
      name="numberOfAttempts"
      value={numberOfAttempts}
      onChange={handleChange}
      className="mb-4 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </>
);

export default NumberOfAttemptsInput;
