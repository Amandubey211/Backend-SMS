import React, { useState, useCallback, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { ImSpinner3 } from "react-icons/im";
import toast, { Toaster } from "react-hot-toast";

const Editor = ({
  editorContent,
  onEditorChange,
  onNext, // Include onNext to handle moving to the next tab
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
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ script: "sub" }, { script: "super" }],
        ["clean"],
        [{ align: [] }],
        [{ list: "bullet" }, { list: "ordered" }],
        // [{ color: [] }, { background: [] }],
        // ["link", "image", "video"],
        // ["blockquote", "code-block"],
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
    // "color",
    // "background",
    // "link",
    // "image",
    // "video",
    // "script",
  ];

  // Handle content changes in the editor
  const handleEditorChange = (content, delta, source, editor) => {
    onEditorChange(editor.getHTML());
  };

  return (
    <div className="relative w-full bg-white mb-3 p-2">
      <Toaster />
      <ReactQuill
        ref={quillRef}
        value={editorContent}
        onChange={handleEditorChange}
        className={`bg-white  ${isCreateQuestion ? "h-60" : "h-96"}`}
        theme="snow"
        modules={modules}
        formats={formats}
      />

      <button
        onClick={onNext}
        className="mt-12 px-4 py-2 text-white font-medium rounded-md shadow-sm bg-gradient-to-r from-pink-500 to-pink-700  hover:to-pink-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Next
      </button>

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
    </div>
  );
};

export default Editor;
