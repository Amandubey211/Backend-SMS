import React from "react";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";

const Editor = ({
  assignmentLabel,
  hideInput,
  assignmentName,
  editorContent,
  onNameChange,
  onEditorChange,
}) => {
  return (
    <div className="w-full p-6 bg-white mb-3">
      {!hideInput && (
        <>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            {assignmentLabel}
          </label>
          <input
            type="text"
            value={assignmentName}
            onChange={(e) => onNameChange(e.target.value)}
            className="mb-4 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </>
      )}
      <ReactQuill
        value={editorContent}
        onChange={onEditorChange}
        className="bg-white"
        theme="snow"
        style={{ height: "300px" }} // Adjust the height as needed
      />
    </div>
  );
};

export default Editor;
