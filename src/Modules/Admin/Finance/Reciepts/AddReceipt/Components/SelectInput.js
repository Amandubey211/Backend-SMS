import React from "react";
import { useField } from "formik";
import { motion } from "framer-motion";

const SelectInput = ({
  label,
  name,
  options,
  disabled,
  autoComplete = "off",
  onChange, // Accept onChange as a prop
  required = false, // Add required prop with default value false
}) => {
  const [field, meta] = useField(name);

  const handleChange = (e) => {
    field.onChange(e); // Formik's onChange
    if (onChange) {
      onChange(e); // Custom onChange for additional logic
    }
  };

  return (
    <motion.div
      className="relative w-full mb-4"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.label
        htmlFor={name}
        className="text-sm text-gray-500 block mb-1"
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </motion.label>
      <select
        {...field}
        id={name}
        name={name}
        disabled={disabled || false}
        autoComplete={autoComplete}
        onChange={handleChange} // Use the custom handleChange
        className={`bg-white border border-gray-300 rounded-md px-4 py-3 text-sm text-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-purple-300 ${
          disabled ? "cursor-not-allowed" : ""
        }`}
      >
        <option value="" label={`Select ${label}`} />
        {options.map((option, index) => (
          <motion.option
            key={index}
            value={option.value}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {option.label}
          </motion.option>
        ))}
      </select>
      {meta.touched && meta.error ? (
        <motion.div
          className="text-sm text-red-500 mt-1"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {meta.error}
        </motion.div>
      ) : null}
    </motion.div>
  );
};

export default SelectInput;
