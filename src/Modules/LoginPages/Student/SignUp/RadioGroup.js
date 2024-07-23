import React from "react";

const RadioGroup = ({ label, name, value, onChange, options, required }) => (
  <div className="mb-4">
    {label && (
      <label className="block text-lg font-semibold mb-2 mt-2 text-gray-700">
        {label}
      </label>
    )}
    <div className="mt-1 flex items-center">
      {options.map((option, index) => (
        <label key={index} className="inline-flex items-center mr-4">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={onChange}
            className="h-4 w-4 border-gray-300 focus:ring-green-500"
            required={required}
          />
          <span className="ml-2">{option.label}</span>
        </label>
      ))}
    </div>
  </div>
);

export default RadioGroup;
