// src/Components/Admin/Finance/Earnings/Component/TextInput.jsx

import React from "react";
import { Field, ErrorMessage } from "formik";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

const TextInput = ({
  label,
  name,
  type = "text",
  placeholder,
  autoComplete = "off",
}) => {
  const readOnly = useSelector((state) => state.admin.earnings.readOnly);

  const variants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="relative w-full mb-4"
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={{ duration: 0.3 }}
    >
      <label htmlFor={name} className="text-sm text-gray-500 block mb-1">
        {label}
      </label>
      <Field
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={readOnly}
        readOnly={readOnly}
        className={`bg-white border border-gray-300 rounded-sm px-4 py-3 text-sm text-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-purple-300 ${
          readOnly ? "cursor-not-allowed" : ""
        }`}
      />
      <ErrorMessage
        name={name}
        component="div"
        className="text-sm text-red-500 mt-1"
      />
    </motion.div>
  );
};

export default TextInput;
