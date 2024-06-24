// LabeledInput.jsx
import React from 'react';

const LabeledInput = ({ label, name, value, onChange, type = 'text' }) => (
  <div>
    <label className="block mb-2 text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className=" w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export default LabeledInput;
