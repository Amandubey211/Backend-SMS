import React, { useState } from "react";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";

const Editor = ({ editorContent, onEditorChange, onSubmit }) => {
  const handleSubmit = () => {
    console.log("Editor Content:", editorContent);
    onSubmit();
  };

  return (
    <div className="w-full flex flex-col   p-6 h-screen bg-white mb-3 shadow-md rounded-lg">
      <div>
        <ReactQuill
          value={editorContent}
          onChange={onEditorChange}
          className="bg-white"
          theme="snow"
          style={{ height: "300px" }} // Adjust the height as needed
        />
      </div>

      <div>
        <button
          onClick={handleSubmit}
          className="mt-[70px] px-4 py-2 text-white font-medium rounded-md shadow-sm bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Editor;
