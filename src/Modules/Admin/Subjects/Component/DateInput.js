import React, { forwardRef } from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";

/**
 * Ant Design DatePicker wrapped to keep the signature:
 * handleChange({ target: { name, value } })
 */
const DateInput = forwardRef(
  ({ label, name, value, handleChange, error, fieldId, disabled }, ref) => {
    const dayValue = value ? dayjs(value) : null;

    const onPick = (dateObj) => {
      const iso = dateObj ? dateObj.toISOString() : "";
      handleChange({ target: { name, value: iso } });
    };

    return (
      <div className="mb-4">
        <label
          htmlFor={fieldId}
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        <DatePicker
          size="large"
          id={fieldId}
          ref={ref}
          disabled={disabled}
          className="w-full"
          value={dayValue}
          onChange={onPick}
          status={error ? "error" : ""}
          format="YYYY-MM-DD"
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

DateInput.displayName = "DateInput";

export default DateInput;
