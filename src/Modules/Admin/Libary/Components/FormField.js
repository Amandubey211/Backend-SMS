import React from "react";

const FormField = ({
  id,
  name,
  label,
  value,
  onChange,
  options = [],
  width,
  disabled,
}) => {
  return (
    <div className={`w-full ${width ? width : "w-52"}`}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="block mt-1 p-2 w-52 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        disabled={disabled} // Conditionally disable the select field
      >
        <option value="">Choose</option>
        {options.map((option, index) =>
          typeof option === "string" ? (
            <option key={index} value={option.toLowerCase()}>
              {option}
            </option>
          ) : (
            <option key={index} value={option?.value}>
              {option?.label}
            </option>
          )
        )}
      </select>
    </div>
  );
};

export default FormField;
