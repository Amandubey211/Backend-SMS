import React, { useRef, memo, useEffect, useState, useMemo } from "react";
import JoditEditor from "jodit-react";
import DOMPurify from "dompurify";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { ImSpinner3 } from "react-icons/im";
const EditorComponent = ({
  editorContent,
  onEditorChange,
  onNext,
  isCreateQuestion,
  submissionType,
}) => {
  const editor = useRef(null);
  const [loading, setLoading] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Function to create and show a custom progress bar below the toolbar
  const showProgressBar = (editorInstance) => {
    const toolbar = editorInstance.toolbar.container;
    const progressBarContainer = document.createElement("div");
    progressBarContainer.style.position = "relative";
    progressBarContainer.style.top = "0";
    progressBarContainer.style.left = "0";
    progressBarContainer.style.width = "100%";
    progressBarContainer.style.height = "5px";
    progressBarContainer.style.backgroundColor = "#f0f0f0"; // Light background for contrast

    const progressBar = document.createElement("div");
    progressBar.style.width = "0%";
    progressBar.style.height = "100%";
    progressBar.style.backgroundColor = "#C71585"; // Dark pink color
    progressBar.style.transition = "width 0.3s";

    progressBarContainer.appendChild(progressBar);
    toolbar.parentNode.insertBefore(progressBarContainer, toolbar.nextSibling);

    return progressBar;
  };

  // Function to update the progress bar
  const updateProgressBar = (progressBar, percentage) => {
    if (progressBar) {
      progressBar.style.width = `${percentage}%`;
    }
  };

  // Function to remove the progress bar
  const removeProgressBar = (editorInstance, progressBar) => {
    if (progressBar) {
      progressBar.style.width = "100%";
      setTimeout(() => {
        if (progressBar.parentNode) {
          progressBar.parentNode.remove();
        }
      }, 500);
    }
  };

  // Handle image upload with progress bar
  const handleImageUpload = async (file) => {
    if (!file) return;

    const editorInstance = editor.current;
    let progressBar;

    // Save the current scroll position
    setScrollPosition(window.scrollY);

    if (editorInstance) {
      progressBar = showProgressBar(editorInstance); // Show custom progress bar below toolbar
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET);
    formData.append("folder", "assignments"); // Specify folder name

    try {
      const response = await axios.post(
        process.env.REACT_APP_CLOUDINARY_URL,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percentage = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            updateProgressBar(progressBar, percentage); // Update progress bar
          },
        }
      );

      if (response.data.secure_url) {
        const imageUrl = response.data.secure_url;
        const imgHTML = `<img src="${imageUrl}" alt="Uploaded Image" />`;
        editorInstance.selection.insertHTML(imgHTML);
        toast.success("Image Uploaded Successfully");
      } else {
        toast.error("Image upload failed. No secure URL returned.");
      }
    } catch (error) {
      console.error("Error uploading image to Cloudinary", error);
      toast.error("Error uploading image. Please try again.");
    } finally {
      if (editorInstance) {
        removeProgressBar(editorInstance, progressBar); // Remove progress bar
      }
      window.scrollTo(0, scrollPosition); // Restore the scroll position
      setLoading(false);
    }
  };

  // Handle PDF file upload with progress bar and styled link
  const handleFileUpload = async (file) => {
    if (!file) return;

    const editorInstance = editor.current;
    let progressBar;

    // Save the current scroll position
    setScrollPosition(window.scrollY);

    if (editorInstance) {
      progressBar = showProgressBar(editorInstance); // Show custom progress bar below toolbar
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET);
    formData.append("folder", "assignments"); // Specify folder name

    try {
      const response = await axios.post(
        process.env.REACT_APP_CLOUDINARY_URL,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percentage = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            updateProgressBar(progressBar, percentage); // Update progress bar
          },
        }
      );

      if (response.data.secure_url) {
        const fileUrl = response.data.secure_url;

        // Enhanced styled PDF link
        const pdfLink = `
          <a href="${fileUrl}" target="_blank" rel="noopener noreferrer" style="
            display: inline-flex;
            align-items: center;
            padding: 8px 16px;
            background-color: #C71585;
            color: #fff;
            border-radius: 4px;
            text-decoration: none;
            font-weight: bold;
            margin: 10px 0;
          ">
            📄 View PDF
          </a>
        `;

        editorInstance.selection.insertHTML(pdfLink);
        toast.success("PDF Uploaded Successfully");
      } else {
        toast.error("File upload failed. No secure URL returned.");
      }
    } catch (error) {
      console.error("Error uploading PDF to Cloudinary", error);
      toast.error("Error uploading file. Please try again.");
    } finally {
      if (editorInstance) {
        removeProgressBar(editorInstance, progressBar); // Remove progress bar
      }
      window.scrollTo(0, scrollPosition); // Restore the scroll position
      setLoading(false);
    }
  };

  // Trigger image upload
  const triggerImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setLoading(true);
        handleImageUpload(file);
      }
    };
    input.click();
  };

  // Trigger PDF upload
  const triggerFileUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/pdf";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setLoading(true);
        handleFileUpload(file);
      }
    };
    input.click();
  };

  // Jodit Editor Configuration
  const config = useMemo(
    () => ({
      readonly: false, // Editor is always editable, but specific parts are protected
      height: isCreateQuestion ? 300 : 400,
      spellcheck: true,
      toolbarSticky: true,
      toolbarAdaptive: false,
      showCharsCounter: true,
      showWordsCounter: true,
      showXPathInStatusbar: false,
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      removeButtons: ["about"],
      buttons: [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "superscript",
        "subscript",
        "|",
        "ul",
        "ol",
        "outdent",
        "indent",
        "|",
        "font",
        "fontsize",
        "brush",
        "paragraph",
        "align",
        "|",
        "image",
        "file",
        "video",
        "link",
        "|",
        "undo",
        "redo",
        "eraser",
        "copyformat",
        "fullsize",
        "selectall",
      ],
      events: {
        change: (newContent) => {
          onEditorChange(newContent);
        },
        afterInit: (editorInstance) => {
          editor.current = editorInstance;

          if (submissionType === "Online-textEntry") {
            // Protect non-editable spans
            const protectSpans =
              editorInstance.container.querySelectorAll("span.non-editable");

            protectSpans.forEach((span) => {
              span.setAttribute("contenteditable", "false");
              span.style.userSelect = "none";
              span.style.pointerEvents = "none";
            });

            // Prevent deletion of non-editable spans
            editorInstance.events.on("beforeDelete", (event) => {
              const selection = editorInstance.selection.current;
              if (selection) {
                const selectedNode = selection.focusNode.parentNode;
                if (selectedNode.classList.contains("non-editable")) {
                  event.preventDefault();
                  toast.error("Cannot delete read-only content.");
                }
              }
            });
          }
        },
      },
      uploader: {
        insertImageAsBase64URI: false, // Prevents inserting images as base64
      },
      filebrowser: {
        ajax: {
          url: "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
        },
      },
      // Protect custom <protected> tags when submissionType is "Online-textEntry"
      protectedTags: submissionType === "Online-textEntry" ? ["protected"] : [],
    }),
    [isCreateQuestion, onEditorChange, submissionType]
  );

  return (
    <div className="relative w-full bg-white mb-3 p-2">
      <Toaster />
      <JoditEditor
        ref={editor}
        value={editorContent}
        config={config}
        tabIndex={1} // tabIndex of textarea
      />

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
          <div className="flex items-center justify-center">
            <ImSpinner3
              style={{
                fontSize: "48px",
                color: "#C71585",
              }}
              className="spinner"
            />
          </div>
        </div>
      )}

      {submissionType === "Online-textEntry" && (
        <button
          onClick={onNext}
          className="mt-4 px-4 py-2 text-white font-medium rounded-md shadow-sm bg-gradient-to-r from-pink-500 to-pink-700 hover:to-pink-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-transform duration-200 ease-in-out"
        >
          Next
        </button>
      )}

      {/* Optional: Buttons for image and PDF upload */}
      {/* {submissionType === "Online-textEntry" && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={triggerImageUpload}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Upload Image
          </button>
          <button
            onClick={triggerFileUpload}
            className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Upload PDF
          </button>
        </div>
      )} */}

      <style jsx>{`
        .editable-blank {
          border-bottom: 2px solid #c71585;
          display: inline-block;
          min-width: 50px;
          text-align: center;
          padding: 2px 4px;
          margin: 0 2px;
        }

        .editable-blank:focus {
          outline: none;
          border-color: #a50b5e;
          background-color: #fff0f5; /* Light pink background on focus */
        }

        .non-editable {
          user-select: none;
          pointer-events: none;
        }

        /* Spinner animation */
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        /* Button active state */
        button:active {
          transform: scale(0.98); /* Slightly scale down on click */
        }
      `}</style>
    </div>
  );
};

export default memo(EditorComponent);
