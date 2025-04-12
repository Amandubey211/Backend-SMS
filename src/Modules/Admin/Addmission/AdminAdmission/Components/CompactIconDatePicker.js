import React from "react";
import { Form, DatePicker, Space, Tooltip } from "antd";
import { useField } from "formik";
import dayjs from "dayjs"; // Import dayjs for date manipulation

const CompactIconDatePicker = ({
  name,
  icon,
  tooltip,
  placeholder,
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
          <DatePicker
            {...rest}
            allowClear
            placeholder={placeholder}
            className="w-full"
            // Convert the string value to a dayjs object if it exists.
            value={field.value ? dayjs(field.value) : null}
            onChange={(date) => {
              // When a valid date is selected, format it as a string; otherwise, clear the value.
              helpers.setValue(date ? date.format("YYYY-MM-DD") : "");
            }}
            onBlur={() => helpers.setTouched(true)}
          />
        </Space.Compact>
      </Tooltip>
    </Form.Item>
  );
};

export default CompactIconDatePicker;
