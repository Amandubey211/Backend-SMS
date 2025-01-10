import React from "react";
import { Field, ErrorMessage } from "formik";
import { motion } from "framer-motion";

const TextInputWithSuffix = ({ label, name, type = "text", placeholder, disabled, required = false, autoComplete = "off", suffix }) => {
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
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <Field
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          disabled={disabled || false}
          className={`bg-white border border-gray-300 rounded-md px-4 py-3 pr-8 text-sm text-gray-800 w-full focus:outline-none focus:ring-2 ${
            required ? 'focus:ring-red-300' : 'focus:ring-purple-300'
          }`}
          autoComplete={autoComplete}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {suffix}
          </span>
        )}
      </div>
      <ErrorMessage
        name={name}
        component="div"
        className="text-sm text-red-500 mt-1"
      />
    </motion.div>
  );
};

export default TextInputWithSuffix;
