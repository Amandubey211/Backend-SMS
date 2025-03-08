// DateInput.jsx
import React, { forwardRef } from "react";
import { format } from "date-fns";

const DateInput = forwardRef(
  ({ label, name, value, handleChange, error, fieldId, disabled }, ref) => {
    const formattedValue = value ? format(new Date(value), "yyyy-MM-dd") : "";
    return (
      <div className="mb-4">
        <label
          htmlFor={fieldId}
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        <input
          id={fieldId}
          type="date"
          name={name}
          value={formattedValue}
          onChange={handleChange}
          ref={ref}
          disabled={disabled}
          className={`w-full p-3 border rounded-md shadow-sm focus:outline-none ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          }`}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

DateInput.displayName = "DateInput";

export default DateInput;
