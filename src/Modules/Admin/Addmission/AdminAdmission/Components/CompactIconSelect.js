// import React from "react";
// import { Form, Select, Space, Tooltip } from "antd";
// import { useField } from "formik";

// const { Option } = Select;
// const CompactIconSelect = ({
//   name,
//   icon,
//   tooltip,
//   placeholder,
//   options = [],
//   ...rest
// }) => {
//   const [field, meta, helpers] = useField(name);
//   const hasError = meta.touched && meta.error;

//   return (
//     <Form.Item
//       validateStatus={hasError ? "error" : ""}
//       help={hasError && meta.error}
//     >
//       <Tooltip title={tooltip}>
//         <Space.Compact className="w-full">
//           <div
//             className={`
//               flex
//               items-center
//               px-[11px]
//               border
//               border-r-0
//               rounded-l-md
//               ${
//                 hasError
//                   ? " border-[#ff4d4f] text-red-500"
//                   : "bg-[#fafafa] border-gray-300"
//               }
//             `}
//           >
//             {icon}
//           </div>
//           <Select
//             className="w-full"
//             allowClear
//             showSearch

//             placeholder={placeholder}
//             value={field.value || undefined}
//             onChange={(value) => helpers.setValue(value)}
//             onBlur={() => helpers.setTouched(true)}
//             status={hasError ? "error" : ""}
//             {...rest}
//           >
//             {options.map((opt) => (
//               <Option key={opt.value} value={opt.value}>
//                 {opt.label}
//               </Option>
//             ))}
//           </Select>
//         </Space.Compact>
//       </Tooltip>
//     </Form.Item>
//   );
// };

// export default CompactIconSelect;
/* CompactIconSelect.js  (single value + custom entry) */
/* CompactIconSelect.js  |  Single-value select with optional custom entry
   --------------------------------------------------------------------- */
/* CompactIconSelect.js  (single value + custom entry) */

import React, { useMemo, useState } from "react";
import { Form, Select, Space, Tooltip } from "antd";
import { useField } from "formik";

const { Option } = Select;

const CompactIconSelect = ({
  name,
  icon,
  options = [],
  tooltip,
  placeholder,
  required,
  allowCustom = false, // enable typed entries
  ...rest
}) => {
  const [field, meta, helpers] = useField(name);
  const hasError = meta.touched && meta.error;

  const [localOptions, setLocalOptions] = useState(options);

  /** -----------------------------------------------------------
   * AntD's tags mode is inherently multi-select, so we:
   *  1. Accept the array it gives.
   *  2. Always pick the **last** item as the true single value.
   *  3. Feed Select an array with at most one element.
   * ---------------------------------------------------------- */
  const handleChange = (valuesArray) => {
    const incoming = Array.isArray(valuesArray) ? valuesArray : [valuesArray];
    const nextValue = incoming[incoming.length - 1] || "";

    // Append unseen value to option list (if custom allowed)
    if (
      allowCustom &&
      nextValue &&
      !localOptions.some((o) => o.value === nextValue)
    ) {
      setLocalOptions((prev) => [
        ...prev,
        { label: nextValue, value: nextValue },
      ]);
    }

    helpers.setValue(nextValue);
  };

  const renderedOptions = useMemo(
    () =>
      localOptions.map((opt) => (
        <Option key={opt.value} value={opt.value}>
          {opt.label}
        </Option>
      )),
    [localOptions]
  );

  return (
    <Form.Item
      validateStatus={hasError ? "error" : ""}
      help={hasError && meta.error}
      required={required}
    >
      <Tooltip title={tooltip}>
        <Space.Compact className="w-full">
          {/* icon */}
          <div
            className={`flex items-center px-[11px] border border-r-0 rounded-l-md ${
              hasError
                ? "border-[#ff4d4f] text-red-500"
                : "bg-[#fafafa] border-gray-300"
            }`}
          >
            {icon}
          </div>

          {/* Select */}
          <Select
            mode={allowCustom ? "tags" : undefined}
            allowClear
            showSearch
            placeholder={placeholder}
            /** keep Select value as single-element array in tags mode */
            value={field.value ? [field.value] : []}
            onChange={handleChange}
            onBlur={() => helpers.setTouched(true)}
            status={hasError ? "error" : ""}
            {...rest}
          >
            {renderedOptions}
          </Select>
        </Space.Compact>
      </Tooltip>
    </Form.Item>
  );
};

export default CompactIconSelect;
