import React from "react";
import { Field, ErrorMessage } from "formik";

const TextInput = ({ label, name, type = "text", placeholder }) => (
  <div className="relative w-full mb-4">
    <label htmlFor={name} className="text-sm text-gray-500 block mb-1">
      {label}
    </label>
    <Field
      id={name}
      name={name}
      type={type}
      placeholder={placeholder}
      className="bg-white border border-gray-300 rounded-sm px-4 py-3 text-sm text-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-purple-300"
    />
    <ErrorMessage
      name={name}
      component="div"
      className="text-sm text-red-500 mt-1"
    />
  </div>
);

export default TextInput;
