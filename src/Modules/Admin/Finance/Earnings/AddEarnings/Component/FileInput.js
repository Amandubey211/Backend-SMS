// src/Components/Admin/Finance/Earnings/Component/FileInput.jsx

import React, { useState, useRef } from "react";
import { ErrorMessage } from "formik";
import { IoIosCloudUpload, IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux"; // Import useSelector

const FileInput = ({ label, name, onChange }) => {
  // Subscribe to Redux state
  const readOnly = useSelector((state) => state.admin.earnings.readOnly);

  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    if (readOnly) return;
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      onChange(event); // Update Formik's value
    }
  };

  const handleFileReset = () => {
    if (readOnly) return;
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onChange({ target: { name, value: null } }); // Reset Formik value
  };

  return (
    <div className="relative w-full mb-4">
      <label className="text-sm text-gray-500 block mb-1">{label}</label>
      <div
        className={`relative bg-purple-50 border border-gray-300 rounded-md px-4 py-3 flex items-center justify-between cursor-pointer shadow-sm ${
          readOnly ? "cursor-not-allowed" : ""
        }`}
      >
        <input
          ref={fileInputRef}
          id={name}
          name={name}
          type="file"
          onChange={handleFileChange}
          disabled={readOnly}
          className="absolute inset-0 w-full h-full opacity-0 "
        />
        <div className="flex items-center gap-2">
          <IoIosCloudUpload className="text-purple-500 text-xl" />
          <span
            className={`${
              fileName ? "text-gray-800 font-medium" : "text-gray-400"
            } truncate`}
          >
            {fileName || "No file selected"}
          </span>
        </div>
        {fileName && !readOnly && (
          <button
            type="button"
            onClick={handleFileReset}
            className="text-gray-500 hover:text-red-500 transition"
            aria-label="Remove file"
          >
            <IoMdClose className="text-xl" />
          </button>
        )}
      </div>
      <ErrorMessage
        name={name}
        component="div"
        className="text-sm text-red-500 mt-1"
      />
    </div>
  );
};

export default FileInput;
