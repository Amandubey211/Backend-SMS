import React from "react";

const FileInput = ({ onChange, file }) => {
  return (
    <div className="flex flex-col w-full md:w-3/10">
      <label htmlFor="attachment" className="text-gray-500 mb-1">
        Attachment
      </label>
      <div className="flex items-center border border-gray-300 rounded p-2">
        <input
          id="attachment"
          type="file"
          className="hidden"
          onChange={onChange}
        />
        <label
          htmlFor="attachment"
          className="cursor-pointer bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 transition px-4 rounded-full mr-2"
        >
          <span className="text-gradient text-sm ">Choose file</span>
        </label>
        <span className="text-gray-500">{file ? file.name : "No file selection"}</span>
      </div>
    </div>
  );
};

export default FileInput;