import React from "react";
import { ErrorMessage } from "formik";
import { IoIosArrowUp } from "react-icons/io";

const FileInput = ({ label, name, onChange }) => (
  <div className="relative w-full mb-4">
    <label className="text-sm text-gray-500 block mb-1">{label}</label>
    <div className="relative bg-purple-50 border border-gray-300 rounded-sm px-4 py-3  flex justify-between items-center cursor-pointer shadow-sm">
      <input
        id={name}
        name={name}
        type="file"
        onChange={onChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <span className="text-gray-800 font-medium">Upload file</span>
      <IoIosArrowUp className="text-gray-800 text-lg" />
    </div>
    <ErrorMessage
      name={name}
      component="div"
      className="text-sm text-red-500 mt-1"
    />
  </div>
);

export default FileInput;
