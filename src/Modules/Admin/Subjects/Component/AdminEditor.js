import React, { memo, useState, useRef, useCallback, useMemo } from "react";
import JoditEditor from "jodit-react";
import axios from "axios";
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
    progressBarContainer.style.backgroundColor = "#f0f0f0"; // Lighter background color for contrast

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
  const handleImageUpload = useCallback(
    async (file) => {
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
      }
    },
    [scrollPosition]
  );

  // Handle PDF file upload with progress bar and styled link
  const handleFileUpload = useCallback(
    async (file) => {
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
      }
    },
    [scrollPosition]
  );

  // Trigger image upload
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

  // Trigger PDF upload
  const triggerFileUpload = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/pdf";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        handleFileUpload(file);
      }
    };
    input.click();
  }, [handleFileUpload]);

  // Jodit Editor Configuration
  const config = useMemo(
    () => ({
      readonly: false,
      height: isCreateQuestion ? 300 : 400,
      spellcheck: true,
      toolbarSticky: true,
      toolbarAdaptive: false,
      showCharsCounter: true,
      showWordsCounter: true,
      showXPathInStatusbar: false,
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      removeButtons: ["powered-by-jodit"],
      buttons: [
        "font",
        "fontsize",
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "hr",
        "superscript",
        "subscript",
        "align",
        "ul",
        "ol",
        "outdent",
        "indent",
        "symbols",
        "brush",
        "undo",
        "redo",
        "spellcheck",
        "table",
        {
          name: "image",
          tooltip: "Upload Image",
          exec: triggerImageUpload, // Image upload logic
        },
        {
          name: "file",
          tooltip: "Upload File (PDF)",
          exec: triggerFileUpload, // PDF upload logic
        },
        "video",
        "link",
        "preview",
        "fullsize",
        "print",
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
    [isCreateQuestion, onEditorChange, triggerImageUpload, triggerFileUpload]
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
              spellCheck="true"
            />
          </div>
        </div>
      )}

      <JoditEditor
        ref={editor}
        value={editorContent}
        config={config}
        tabIndex={1}
      />
    </div>
  );
};

export default memo(EditorComponent);
