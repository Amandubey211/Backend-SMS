// TextInput.js

import React from "react";

const TextInput = React.forwardRef(
  (
    {
      name,
      value,
      onChange,
      placeholder,
      type = "text",
      readOnly = false,
      error,
    },
    ref
  ) => (
    <div className="flex flex-col w-full">
      <input
        ref={ref}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`mt-1 block w-full px-3 py-3 border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
        readOnly={readOnly}
      />
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  )
);

export default TextInput;
