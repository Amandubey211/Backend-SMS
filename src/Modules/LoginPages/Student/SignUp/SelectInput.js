import React from "react";

const SelectInput = ({ label, name, value, onChange, options, required }) => (
  <div className="w-1/2">
    {label && (
      <label className="block text-lg font-semibold mb-2 mt-2 text-gray-700">
        {label}
      </label>
    )}
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="block w-full rounded-lg border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-700 p-3"
      required={required}
    >
      <option value="" disabled>
        Select {label?.replace("*", "")}
      </option>
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export default SelectInput;
