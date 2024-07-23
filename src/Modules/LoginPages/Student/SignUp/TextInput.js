import React from "react";

const TextInput = ({ name, value, onChange, placeholder, required, type = "text" }) => (
  <div className="flex flex-col w-full">
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      required={required}
    />
  </div>
);

export default TextInput;
