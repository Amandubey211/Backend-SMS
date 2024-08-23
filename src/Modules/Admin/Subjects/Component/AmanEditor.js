import React, { useState, useCallback, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { ImSpinner3 } from "react-icons/im";
import toast, { Toaster } from "react-hot-toast";

const EditorComponent = ({
  assignmentLabel,
  hideInput,
  assignmentName,
  editorContent,
  onNameChange,
  onEditorChange,
  inputPlaceHolder,
  isCreateQuestion,
}) => {
  const quillRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // Handle image upload and display
  const handleImageUpload = useCallback(async () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      setLoading(true);

      const reader = new FileReader();
      reader.onload = () => {
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        quill.insertEmbed(range.index, "image", reader.result);
      };
      reader.readAsDataURL(file); // Show a preview of the image locally

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET);

      try {
        const response = await axios.post(
          process.env.REACT_APP_CLOUDINARY_URL,
          formData
        );
        const imageUrl = response.data.secure_url;
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        quill.deleteText(range.index, 1); // Remove the local preview
        quill.insertEmbed(range.index, "image", imageUrl); // Insert the uploaded image URL
        toast.success("Image Uploaded");
      } catch (error) {
        console.error("Error uploading image to Cloudinary", error);
        toast.error("Error uploading image. Please try again.");
      } finally {
        setLoading(false);
      }
    };
  }, []);

  // Quill modules and formats for toolbar configuration
  const modules = {
    toolbar: {
      container: [
        [
          { header: [1, 2, 3, false] },
          "bold",
          "italic",
          "underline",
          "strike",
          { script: "sub" },
          { script: "super" },
          { align: [] },
          { list: "ordered" },
          { list: "bullet" },
          { color: [] },
          { background: [] },
          "link",
          "image",
          "video",
          "blockquote",
          "code-block",
          "clean",
        ],
      ],
      handlers: {
        image: handleImageUpload,
      },
    },
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "code-block",
    "list",
    "bullet",
    "align",
    "color",
    "background",
    "link",
    "image",
    "video",
    "script",
  ];

  // Handle content changes in the editor
  const handleEditorChange = (content, delta, source, editor) => {
    onEditorChange(editor.getHTML());
  };

  return (
    <div className="relative w-full bg-white mb-3 p-2">
      <Toaster />
      {!hideInput && (
        <div className="flex flex-col md:flex-row items-center gap-4 mb-2">
          <div className="flex flex-col w-full md:w-7/10">
            <label htmlFor="topicTitle" className="text-gray-500 mb-3">
              {assignmentLabel}
            </label>
            <input
              type="text"
              placeholder={inputPlaceHolder}
              value={assignmentName}
              onChange={(e) => onNameChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      <ReactQuill
        ref={quillRef}
        value={editorContent}
        onChange={handleEditorChange}
        className={`bg-white p-2 ${isCreateQuestion ? "h-60" : "h-96"}`}
        theme="snow"
        modules={modules}
        formats={formats}
      />

      {loading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "transparent", // Transparent background
            zIndex: 10,
          }}
        >
          <ImSpinner3
            style={{
              fontSize: "48px",
              color: "#007bff",
              animation: "spin 1s linear infinite",
            }}
          />
        </div>
      )}

      {/* Inline CSS for spinner animation */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          /* Tooltip styles */
          .ql-toolbar .ql-picker-item:hover::after,
          .ql-toolbar .ql-stroke:hover::after,
          .ql-toolbar .ql-fill:hover::after,
          .ql-toolbar .ql-picker-label:hover::after {
            content: attr(title);
            position: absolute;
            background-color: #333;
            color: #fff;
            padding: 5px;
            border-radius: 5px;
            top: -30px;
            left: 50%;
            transform: translateX(-50%);
            white-space: nowrap;
            font-size: 12px;
            z-index: 100; /* Ensure the tooltip is above everything */
          }

          .ql-toolbar .ql-picker-item,
          .ql-toolbar .ql-stroke,
          .ql-toolbar .ql-fill,
          .ql-toolbar .ql-picker-label {
            position: relative;
          }

          /* Ensure all toolbar items are on one line with equal spacing */
          .ql-toolbar {
            display: flex;
            flex-wrap: nowrap;
            white-space: nowrap;
          }

          .ql-toolbar .ql-formats {
            display: inline-flex;
            align-items: center;
            gap: 4px; /* Set equal gap between items */
          }

          .ql-toolbar .ql-formats > button, 
          .ql-toolbar .ql-formats > span,
          .ql-toolbar .ql-formats > select {
            margin: 0;
            padding: 4px; /* Adjust padding as needed */
          }
        `}
      </style>
    </div>
  );
};

export default EditorComponent;
