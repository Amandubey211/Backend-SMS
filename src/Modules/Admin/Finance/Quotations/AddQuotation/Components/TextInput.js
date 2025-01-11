import React from "react";
import { Field, ErrorMessage } from "formik";
import { motion } from "framer-motion";

/**
 * TextInput
 * @param {string} label - Label text
 * @param {string} name - Field name (Formik)
 * @param {string} type - Input type (e.g., 'text', 'number', 'date')
 * @param {string} placeholder - Input placeholder
 * @param {boolean} disabled - Disables the field
 * @param {boolean} required - Shows a red asterisk if field is required
 * @param {string} autoComplete - Browser autocomplete setting
 */
const TextInput = ({
  label,
  name,
  type = "text",
  placeholder,
  disabled,
  required = false,
  autoComplete = "off",
}) => {
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
      {/* Label */}
      {label ? (
        <label htmlFor={name} className="text-sm text-gray-500 block mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      ) : null}

      {/* Input Field */}
      <Field
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled || false}
        className={`bg-white border border-gray-300 rounded-md px-4 py-3 text-sm text-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-purple-300 ${
          disabled ? "cursor-not-allowed opacity-70" : ""
        }`}
        autoComplete={autoComplete}
      />

      {/* Error Message */}
      <ErrorMessage
        name={name}
        component="div"
        className="text-sm text-red-500 mt-1"
      />
    </motion.div>
  );
};

export default TextInput;
