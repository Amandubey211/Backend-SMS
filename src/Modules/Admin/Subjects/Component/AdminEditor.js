import React, { useState, useRef, useCallback, useMemo } from "react";
import JoditEditor from "jodit-react";
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
  const editor = useRef(null);
  const [loading, setLoading] = useState(false);

  // Handle image upload and display
  const handleImageUpload = useCallback(async (file) => {
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET);

    try {
      const response = await axios.post(
        process.env.REACT_APP_CLOUDINARY_URL,
        formData
      );
      console.log(response.data);
      if (response.data.secure_url) {
        const imageUrl = response.data.secure_url;

        // Insert the image using insertHTML
        if (editor.current) {
          const imgHTML = `<img src="${imageUrl}" alt="Image" />`;
          editor.current.selection.insertHTML(imgHTML); // Insert HTML
          toast.success("Image Uploaded Successfully");
        } else {
          toast.error("Failed to insert image into the editor.");
          console.error("Editor instance is not defined.");
        }
      } else {
        toast.error("Image upload failed. No secure URL returned.");
      }
    } catch (error) {
      console.error("Error uploading image to Cloudinary", error);
      toast.error("Error uploading image. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // File input creation and handling
  const triggerImageUpload = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        handleImageUpload(file);
      }
    };
    input.click();
  }, [handleImageUpload]);

  // Jodit Editor Configuration
  const config = useMemo(
    () => ({
      readonly: false,
      height: isCreateQuestion ? 300 : 400,
      spellcheck: true, // Enable spellcheck
      toolbarSticky: true,
      toolbarAdaptive: false,
      showCharsCounter: true, // Show character counter
      showWordsCounter: true, // Show word counter
      showXPathInStatusbar: false,
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      removeButtons: ["powered-by-jodit"], // Remove "Powered by Jodit"
      buttons: [
        "fontsize", // Font size selector
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "hr", // Add Horizontal Rule
        "superscript",
        "subscript",
        "align",
        "ul",
        "ol",
        "outdent",
        "indent",
        "link",
        {
          name: "image",
          icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 7h-3.17l-1.24-1.45A2.01 2.01 0 0014.88 5h-5.76c-.71 0-1.37.39-1.71 1.05L6.17 7H3c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm-9 11c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/>
            </svg>`,
          exec: triggerImageUpload,
          tooltip: "Upload Image",
        },
        "brush", // Font color/brush tool
        "video",
        "table", // Include Table
        "undo", // Add Undo button
        "redo", // Add Redo button
        "preview", // Include Preview
        "fullsize", // Include Fullscreen
      ],
      events: {
        change: (newContent) => {
          onEditorChange(newContent);
        },
        afterInit: (editorInstance) => {
          editor.current = editorInstance;
        },
      },
    }),
    [isCreateQuestion, onEditorChange, triggerImageUpload]
  );

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
              spellCheck="false" // Disabling spell check at the input level
            />
          </div>
        </div>
      )}

      <JoditEditor
        ref={editor}
        value={editorContent}
        config={config}
        tabIndex={1} // tabIndex of textarea
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
          <ImSpinner3 className="text-4xl text-gray-500 animate-spin" />
        </div>
      )}

      {/* Inline CSS for spinner animation */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          /* Ensure toolbar buttons are aligned properly */
          .jodit-toolbar-button {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 4px;
          }
        `}
      </style>
    </div>
  );
};

export default EditorComponent;
