import React from "react";
import { Field, ErrorMessage } from "formik";
import { motion } from "framer-motion";

/**
 * SelectInput
 * @param {string} label - Label text
 * @param {string} name - Field name (Formik)
 * @param {array} options - Array of option strings
 * @param {boolean} disabled - Disables the field
 * @param {boolean} required - Shows a red asterisk if field is required
 * @param {string} autoComplete - Browser autocomplete
 */
const SelectInput = ({
  label,
  name,
  options,
  disabled,
  required = false,
  autoComplete = "off",
}) => {
  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  // Animation for the label and field
  const fieldVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="relative w-full mb-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.3 }}
    >
      {/* Label */}
      <motion.label
        htmlFor={name}
        className="text-sm text-gray-500 block mb-1"
        variants={fieldVariants}
        transition={{ delay: 0.1 }}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </motion.label>

      {/* Select Field */}
      <Field
        as="select"
        id={name}
        name={name}
        disabled={disabled || false}
        autoComplete={autoComplete}
        className={`bg-white border border-gray-300 rounded-md px-4 py-3 text-sm text-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-purple-300 ${
          disabled ? "cursor-not-allowed opacity-70" : ""
        }`}
      >
        <option value="" label={`Select ${label}`} />
        {options.map((option, index) => (
          <motion.option
            key={index}
            value={option}
            variants={fieldVariants}
            transition={{ delay: 0.2 }}
          >
            {option}
          </motion.option>
        ))}
      </Field>

      {/* Error Message */}
      <motion.div
        className="text-sm text-red-500 mt-1"
        variants={fieldVariants}
        transition={{ delay: 0.3 }}
      >
        <ErrorMessage name={name} component="div" />
      </motion.div>
    </motion.div>
  );
};

export default SelectInput;
