import React, { useState, useCallback, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { AiOutlineCloseCircle } from "react-icons/ai"; // Import icon from react-icons
import FileInput from "../Modules/Discussion/AddDiscussion/Components/FileInput";

const EditorComponent = ({
  assignmentLabel,
  hideInput,
  assignmentName,
  editorContent,
  onNameChange,
  onEditorChange,
}) => {
  const quillRef = useRef(null);
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImageUpload = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        const link = e.target.result;
        quill.insertEmbed(range.index, "image", link);
      };
      reader.readAsDataURL(file);
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

  const handleImageClick = (e) => {
    if (e.target.tagName === "IMG") {
      const img = e.target;
      img.style.maxWidth = "200px"; // Adjust image size here
      img.style.maxHeight = "150px"; // Adjust image size here
      img.style.position = "relative"; // Ensure relative positioning for overlay

      const overlay = document.createElement("div");
      overlay.className = "image-overlay";
      overlay.style.position = "absolute";
      overlay.style.top = "5px";
      overlay.style.right = "5px";
      overlay.style.background = "rgba(255, 255, 255, 0.5)";
      overlay.style.cursor = "pointer";
      overlay.style.padding = "5px";
      overlay.style.borderRadius = "50%";
      overlay.style.zIndex = "10"; // Ensure overlay is above the image
      overlay.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6 text-red-600"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>`;
      overlay.onclick = () => {
        img.remove();
      };

      if (!img.parentNode.querySelector(".image-overlay")) {
        img.parentNode.style.position = "relative";
        img.parentNode.appendChild(overlay);
      }
    }
  };

  return (
    <div className="w-full p-6 bg-white mb-3">
      {!hideInput && (
        <>
          <div className="flex flex-col md:flex-row items-center gap-4 mb-3 ">
            <div className="flex flex-col w-full md:w-7/10">
              <label htmlFor="topicTitle" className="text-gray-500 mb-1">
                {assignmentLabel}
              </label>
              <input
                type="text"
                value={assignmentName}
                onChange={(e) => onNameChange(e.target.value)}
                // placeholder="Monthly examination"
                className=" w-full p-2 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <FileInput title="Thumbnail" onChange={handleFileChange} file={file} />
          </div>
        </>
      )}

      <ReactQuill
        ref={quillRef}
        value={editorContent}
        onChange={handleEditorChange}
        className="bg-white"
        theme="snow"
        modules={modules}
        formats={formats}
        style={{ height: "350px" }} // Ensure the editor has a height
        onClick={handleImageClick}
      />
    </div>
  );
};

export default EditorComponent;
