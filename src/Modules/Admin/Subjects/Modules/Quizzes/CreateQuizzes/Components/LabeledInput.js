import React from "react";
import { Input, InputNumber } from "antd";

/**
 * Ant Design input / input-number wrapper that
 * mimics the old event object to stay backward compatible.
 */
const LabeledInput = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  error,
  fieldId,
}) => {
  const trigger = (val) => onChange({ target: { name, value: val } });

  const Control =
    type === "number" ? (
      <InputNumber
        size="large"
        id={fieldId}
        className="w-full"
        value={value}
        onChange={trigger}
        status={error ? "error" : ""}
      />
    ) : (
      <Input
        size="large"
        id={fieldId}
        type={type}
        value={value}
        onChange={(e) => trigger(e.target.value)}
        status={error ? "error" : ""}
      />
    );

  return (
    <div className="mb-4">
      <label htmlFor={fieldId} className="block mb-2 text-gray-700">
        {label}
      </label>
      {Control}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default LabeledInput;
