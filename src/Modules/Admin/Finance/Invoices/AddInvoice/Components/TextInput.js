import React from "react";
import { Field, ErrorMessage } from "formik";
import { motion } from "framer-motion";

const TextInput = ({ label, name, type = "text", placeholder, disabled, autoComplete = "off", required = false }) => {
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
      <Field
        id={name}
        name={name}
        type={type}
        min={0}
        onKeyDown={(e) => {
          if(type == "number"){
           if (["-", "e", "E"].includes(e.key)) {
            e.preventDefault();
          } 
          }
        }}
        placeholder={placeholder}
        disabled={disabled || false}
        className={`bg-white border border-gray-300 rounded-md px-4 py-3 text-sm text-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-purple-300 ${
          disabled ? "cursor-not-allowed bg-gray-100" : ""
        }`}
        autoComplete={autoComplete}
        
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
