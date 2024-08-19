// LabeledSelect.jsx
import React from "react";

const LabeledSelect = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block mb-2 text-gray-700">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className=" w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export default LabeledSelect;
