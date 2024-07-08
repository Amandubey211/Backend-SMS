// MediaUpload.js
import React, { useState } from "react";

const MediaUpload = ({ onSubmit }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = () => {
    if (selectedFile) {
      console.log("Selected file:", selectedFile);
      onSubmit();
    } else {
      alert("Please select a file first");
    }
  };

  return (
    <div className="w-full p-6 bg-white mb-3">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Upload Media
      </label>
      <input
        type="file"
        onChange={handleFileChange}
        className="mb-4 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleSubmit}
        className="mt-8 px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Submit
      </button>
    </div>
  );
};

export default MediaUpload;
