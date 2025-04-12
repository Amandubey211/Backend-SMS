import React from "react";
import { Form, Select, Space, Tooltip } from "antd";
import { useField } from "formik";

const { Option } = Select;
const CompactIconSelect = ({
  name,
  icon,
  tooltip,
  placeholder,
  options = [],
  ...rest
}) => {
  const [field, meta, helpers] = useField(name);
  const hasError = meta.touched && meta.error;

  return (
    <Form.Item
      validateStatus={hasError ? "error" : ""}
      help={hasError && meta.error}
    >
      <Tooltip title={tooltip}>
        <Space.Compact className="w-full">
          <div
            className={`
              flex
              items-center
              px-[11px]
              border
              border-r-0
              rounded-l-md
              ${
                hasError
                  ? " border-[#ff4d4f] text-red-500"
                  : "bg-[#fafafa] border-gray-300"
              }
            `}
          >
            {icon}
          </div>
          <Select
            className="w-full"
            allowClear
            placeholder={placeholder}
            value={field.value || undefined}
            onChange={(value) => helpers.setValue(value)}
            onBlur={() => helpers.setTouched(true)}
            status={hasError ? "error" : ""}
            {...rest}
          >
            {options.map((opt) => (
              <Option key={opt.value} value={opt.value}>
                {opt.label}
              </Option>
            ))}
          </Select>
        </Space.Compact>
      </Tooltip>
    </Form.Item>
  );
};

export default CompactIconSelect;
