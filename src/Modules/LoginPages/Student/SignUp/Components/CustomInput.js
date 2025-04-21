// src/components/Forms/CustomInput.jsx
import React from "react";
import { Input } from "antd";

/**
 * A reusable input that applies uniform Tailwind + Ant Design styles.
 * You can similarly create CustomSelect, CustomDatePicker, etc.
 */
const CustomInput = ({ className = "", ...props }) => {
  return (
    <Input
      {...props}
      className={`w-full rounded-lg  focus:border-pink-500 transition-colors ${className}`}
    />
  );
};

export default CustomInput;
