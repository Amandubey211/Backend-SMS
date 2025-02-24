import React from "react";

const LabeledInput = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  error,
  fieldId,
}) => (
  <div className="mb-4">
    <label htmlFor={fieldId} className="block mb-2 text-gray-700">
      {label}
    </label>
    <input
      id={fieldId} // use fieldId
      type={type}
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
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default LabeledInput;
