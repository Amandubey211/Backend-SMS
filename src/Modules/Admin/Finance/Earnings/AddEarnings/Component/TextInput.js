// src/Components/Admin/Finance/Earnings/Component/TextInput.jsx

import React from "react";
import { useField } from "formik";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

const TextInput = ({
  label,
  name,
  type = "text",
  placeholder,
  autoComplete = "off",
  disabled = false, // Added disabled prop with default value
  required = false,
  // Added required prop
}) => {
  const readOnly = useSelector((state) => state.admin.earnings.readOnly);
  const [field, meta] = useField(name);

  const variants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    error: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.div
      className="relative w-full mb-4"
      variants={variants}
      initial="hidden"
      animate={meta.touched && meta.error ? "error" : "visible"}
      transition={{ duration: 0.3 }}
    >
      <label htmlFor={name} className="text-sm text-gray-500 block mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        {...field}
        type={type}
        placeholder={placeholder}
        disabled={disabled || readOnly}
        min={0}
        onKeyDown={(e) => {
          if (type == "number") {
            if (["-", "e", "E"].includes(e.key)) {
              e.preventDefault();
            }
          }
        }}
        className={`bg-white border ${
          meta.touched && meta.error ? "border-red-500" : "border-gray-300"
        } rounded-sm px-4 py-3 text-sm text-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-purple-300`}
        autoComplete={autoComplete}
      />
      {meta.touched && meta.error ? (
        <div className="text-sm text-red-500 mt-1">{meta.error}</div>
      ) : null}
    </motion.div>
  );
};

export default TextInput;
