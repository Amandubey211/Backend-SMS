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

  // Print the content of the editor
  const handlePrint = useCallback(() => {
    if (editor.current) {
      const printWindow = window.open("", "PRINT", "height=600,width=800");
      printWindow.document.write(`
        <html>
        <head><title>Print</title></head>
        <body>${editor.current.value}</body>
        </html>
      `);
      printWindow.document.close(); // Necessary for some browsers
      printWindow.focus(); // Necessary for some browsers
      printWindow.print();
      printWindow.close();
    }
  }, []);

  // Jodit Editor Configuration
  const config = useMemo(
    () => ({
      readonly: false,
      height: isCreateQuestion ? 300 : 400,
      spellcheck: true, // Enable browser's native spellcheck in the editor
      toolbarSticky: true,
      toolbarAdaptive: false,
      showCharsCounter: true, // Show character counter
      showWordsCounter: true, // Show word counter
      showXPathInStatusbar: false,
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      removeButtons: ["powered-by-jodit"], // Remove "Powered by Jodit"
      buttons: [
        "font", // Font family selector
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
        "symbols",
        "brush", // Font color/brush tool

        "undo", // Add Undo button
        "redo", // Add Redo button
        "spellcheck",

        "table", // Include Table

        {
          name: "image",
          tooltip: "Upload Image",
          exec: triggerImageUpload,
        },

        "video",
        "file",
        "link",
        "preview", // Include Preview
        "fullsize", // Include Fullscreen
        {
          name: "print",
          tooltip: "Print Content",
          exec: handlePrint,
        },
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
    [isCreateQuestion, onEditorChange, triggerImageUpload, handlePrint]
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
              spellCheck="true" // Enable spell check in input field
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
