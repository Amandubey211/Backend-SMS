import React from "react";

const LabeledSelect = ({
  label,
  name,
  value,
  onChange,
  options,
  error,
  fieldId, // pass in from parent
}) => (
  <div className="mb-4">
    <label htmlFor={fieldId} className="block mb-2 text-gray-700">
      {label}
    </label>
    <select
      id={fieldId} // use fieldId for scrolling
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full p-3 border rounded-md shadow-sm focus:outline-none
        ${
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:ring-blue-500"
        }
      `}
    >
      {options?.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default LabeledSelect;
