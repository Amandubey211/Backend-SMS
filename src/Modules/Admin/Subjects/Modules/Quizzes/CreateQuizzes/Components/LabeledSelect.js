import React from "react";
import { Select } from "antd";

/**
 * Ant Design‐backed select that still fires
 * `handleChange({ target: { name, value } })`
 * so existing handlers keep working.
 */
const LabeledSelect = ({
  label,
  name,
  value,
  onChange,
  options,
  error,
  fieldId,
}) => {
  const handleSelect = (val) => onChange({ target: { name, value: val } });

  return (
    <div className="mb-4">
      <label htmlFor={fieldId} className="block mb-2 text-gray-700">
        {label}
      </label>
      <Select
        id={fieldId}
        size="large"
        value={value}
        onChange={handleSelect}
        className="w-full"
        status={error ? "error" : ""}
        options={options}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default LabeledSelect;
