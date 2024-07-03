import React, { useState, useCallback, useMemo } from "react";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import CustomToolbar from "./CustomToolbar";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";

const Editor = ({
  assignmentLabel,
  hideInput,
  assignmentName,
  editorContent,
  onNameChange,
  onEditorChange,
}) => {
  const role = useSelector((store) => store.Auth.role);
  const API_URL = process.env.REACT_APP_API_URL;

  const handleImageUpload = useCallback(async () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const formData = new FormData();
      formData.append("thumbnail", file);

      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.post(
          `${API_URL}/upload_image_endpoint`, // Replace with your actual endpoint
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authentication: token,
            },
          }
        );

        if (response.data && response.data.secure_url) {
          const quillEditor = document.querySelector(".ql-editor");
          const range = quillEditor.getSelection();
          quillEditor.insertEmbed(
            range.index,
            "image",
            response.data.secure_url
          );
        } else {
          toast.error("Failed to upload image.");
        }
      } catch (err) {
        toast.error("Error in uploading image.");
      }
    };
  }, [API_URL, role]);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: "#toolbar",
        handlers: {
          image: handleImageUpload,
        },
      },
    }),
    [handleImageUpload]
  );

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
      <CustomToolbar />
      <ReactQuill
        value={editorContent}
        onChange={onEditorChange}
        className="bg-white"
        theme="snow"
        modules={modules}
        style={{ height: "300px" }} // Adjust the height as needed
      />
    </div>
  );
};

export default Editor;
