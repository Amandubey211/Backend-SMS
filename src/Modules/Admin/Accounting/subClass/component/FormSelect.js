import React from "react";

const FormSelect = ({
  id,
  label,
  options,
  value,
  onChange,
  required = false,
  error,
}) => {
  return (
    <div className="mt-4">
      <label htmlFor={id} className={`block text-sm font-medium text-gray-700`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        required={required}
        className={`mt-1 block w-full pl-3 pr-10 py-2 border ${
          error ? "border-red-500" : "border-gray-300"
        }
         shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md`}
      >
        <option value="">Select {label}</option>
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormSelect;
