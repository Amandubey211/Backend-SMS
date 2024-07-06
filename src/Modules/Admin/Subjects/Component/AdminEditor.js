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
      // formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET);

      console.log(file);
      // try {
      //   const response = await axios.post(
      //     process.env.REACT_APP_CLOUDINARY_URL,
      //     formData
      //   );
      //   const imageUrl = response.data.secure_url;
      //   const quill = quillRef.current.getEditor();
      //   const range = quill.getSelection();
      //   quill.deleteText(range.index, 1); // Remove the placeholder image
      //   quill.insertEmbed(range.index, "image", imageUrl);
      //   setLoading(false);
      // } catch (error) {
      //   console.error("Error uploading image to Cloudinary", error);
      //   setError("Error uploading image. Please try again.");
      //   setLoading(false);
      // }
    };
  }, []);

  const modules = {
    toolbar: {
      container: [
        [{ header: "1" }, { header: "2" }, { font: [] }],
        [{ size: [] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image", "video"],
        ["clean"],
        [{ align: [] }],
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
    "list",
    "bullet",
    "link",
    "image",
    "video",
    "align",
  ];

  const handleEditorChange = (content, delta, source, editor) => {
    onEditorChange(editor.getHTML());
  };

  const handleMediaClick = (e) => {
    if (e.target.tagName === "IMG" || e.target.tagName === "VIDEO") {
      const media = e.target;
      const mediaType = e.target.tagName.toLowerCase();
      const overlay = document.createElement("div");
      overlay.className = "media-overlay";
      overlay.style.position = "absolute";
      overlay.style.top = "5px";
      overlay.style.right = "5px";
      overlay.style.background = "rgba(255, 255, 255, 0.5)";
      overlay.style.cursor = "pointer";
      overlay.style.padding = "5px";
      overlay.style.borderRadius = "50%";
      overlay.style.zIndex = "10"; // Ensure overlay is above the media
      overlay.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6 text-red-600"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>`;
      overlay.onclick = () => {
        media.remove();
      };

      if (!media.parentNode.querySelector(".media-overlay")) {
        media.parentNode.style.position = "relative";
        media.parentNode.appendChild(overlay);
      }
    }
  };

  return (
    <div className="w-full p-6 bg-white mb-3">
      {!hideInput && (
        <div className="flex flex-col md:flex-row items-center gap-4 mb-3">
          <div className="flex flex-col w-full md:w-7/10">
            <label htmlFor="topicTitle" className="text-gray-500 mb-1">
              {assignmentLabel}
            </label>
            <input
              type="text"
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
        onClick={handleMediaClick}
      />

      {loading && (
        <div className="flex items-center justify-center mt-3">
          <FaSpinner className="animate-spin mr-2 text-2xl" />
          <span>Uploading...</span>
        </div>
      )}

      {/* {error && <div className="text-red-500 mt-3">{error}</div>} */}
    </div>
  );
};

export default EditorComponent;
