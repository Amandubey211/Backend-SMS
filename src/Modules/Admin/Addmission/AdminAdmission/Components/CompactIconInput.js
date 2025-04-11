import React from "react";
import { Form, Input, Space, Tooltip } from "antd";
import { useField } from "formik";
const CompactIconInput = ({
  name,
  icon,
  disabled = false,
  tooltip,
  placeholder,
  type = "text",
  ...rest
}) => {
  const [field, meta, helpers] = useField(name);
  const hasError = meta.touched && meta.error;

  return (
    <Form.Item
      // className="mb-2"
      validateStatus={hasError ? "error" : ""}
      help={hasError && meta.error}
    >
      <Tooltip title={tooltip}>
        <Space.Compact className="w-full">
          <Input
            {...rest}
            disabled={disabled}
            type={type}
            name={name}
            allowClear
            value={field.value}
            onChange={(e) => helpers.setValue(e.target.value)}
            onBlur={() => helpers.setTouched(true)}
            addonBefore={icon}
            placeholder={placeholder}
            // size="large"
          />
        </Space.Compact>
      </Tooltip>
    </Form.Item>
  );
};

export default CompactIconInput;
