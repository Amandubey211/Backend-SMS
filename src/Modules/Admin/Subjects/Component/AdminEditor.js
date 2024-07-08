import React, { useState, useCallback, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";

const EditorComponent = ({
  assignmentLabel,
  hideInput,
  assignmentName,
  editorContent,
  onNameChange,
  onEditorChange,
  inputPlaceHolder,
}) => {
  const quillRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      reader.readAsDataURL(file);

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
        quill.deleteText(range.index, 1); // Remove the placeholder image
        quill.insertEmbed(range.index, "image", imageUrl);
        setLoading(false);
      } catch (error) {
        console.error("Error uploading image to Cloudinary", error);
        setError("Error uploading image. Please try again.");
        setLoading(false);
      }
    };
  }, []);

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        [{ font: [] }],
        ["bold", "italic", "underline", "strike"], // toggled buttons
        [{ script: "sub" }, { script: "super" }], // superscript/subscript
        [{ size: [] }],
        ["clean"],
        [{ align: [] }],
        [{ list: "bullet" }, { list: "ordered" }],
        // [{ separator: true }], // Custom separator
        [{ color: [] }, { background: [] }],
        ["link", "image", "video"],
        ["blockquote", "code-block"],
        // remove formatting button
      ],
      handlers: {
        image: handleImageUpload,
      },
    },
  };

  const formats = [
    "header",
    "font",
    "size",
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

  const handleEditorChange = (content, delta, source, editor) => {
    onEditorChange(editor.getHTML());
  };

  return (
    <div className="w-full p-6 bg-white mb-3">
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
        className="bg-white h-72 min-h-[400px] md:min-h-[500px] lg:min-h-[600px] p-2" // Tailwind CSS classes for responsive min height
        theme="snow"
        modules={modules}
        formats={formats}
      />

      {loading && (
        <div className="flex items-center justify-center mt-3">
          <FaSpinner className="animate-spin mr-2 text-2xl" />
          <span>Uploading...</span>
        </div>
      )}

      {error && <div className="text-red-500 mt-3">{error}</div>}
    </div>
  );
};

export default EditorComponent;
