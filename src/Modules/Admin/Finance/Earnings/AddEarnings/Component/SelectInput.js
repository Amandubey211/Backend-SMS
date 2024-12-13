import React from "react";
import { Field, ErrorMessage } from "formik";

const SelectInput = ({ label, name, options }) => (
  <div className="relative w-full mb-4">
    <label htmlFor={name} className="text-sm text-gray-500 block mb-1">
      {label}
    </label>
    <Field
      as="select"
      id={name}
      name={name}
      className="bg-white border border-gray-300 rounded-md px-4 py-3 text-sm text-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-purple-300"
    >
      <option value="">Select</option>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </Field>
    <ErrorMessage
      name={name}
      component="div"
      className="text-sm text-red-500 mt-1"
    />
  </div>
);

export default SelectInput;
