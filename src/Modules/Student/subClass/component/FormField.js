import React from "react";

const FormField = ({ id, name, label, value, onChange, options }) => {
  return (
    <div className="form-field mb-4">
      {/* Label */}
      <label
        htmlFor={id}
        className="block text-gray-500 text-sm font-medium mb-2"
      >
        {label}
      </label>

      {/* Select box */}
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className=" border border-gray-300 bg-white text-gray-700 rounded-md p-2 w-72 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all"
      >
        <option value="">All</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormField;
