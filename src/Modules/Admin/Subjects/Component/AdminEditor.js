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
  // const [loading, setLoading] = useState(false);
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

  // Handle image upload and display
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

      try {
        const response = await axios.post(
          process.env.REACT_APP_CLOUDINARY_URL,
          formData,
          {
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

          // Insert the image using insertHTML
          if (editorInstance) {
            const imgHTML = `<img src="${imageUrl}" alt="Image" />`;
            editorInstance.selection.insertHTML(imgHTML); // Insert HTML
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
        if (editorInstance) {
          removeProgressBar(editorInstance, progressBar); // Remove progress bar
        }
        // setLoading(false);
        // Restore the scroll position
        window.scrollTo(0, scrollPosition);
      }
    },
    [scrollPosition]
  );

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
  // const handlePrint = useCallback(() => {
  //   if (editor.current) {
  //     const printWindow = window.open("", "PRINT", "height=600,width=800");
  //     printWindow.document.write(`
  //       <html>
  //       <head><title>Print</title></head>
  //       <body>${editor.current.value}</body>
  //       </html>
  //     `);
  //     printWindow.document.close(); // Necessary for some browsers
  //     printWindow.focus(); // Necessary for some browsers
  //     printWindow.print();
  //     printWindow.close();
  //   }
  // }, []);

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
        "print",
        // {
        //   name: "print",
        //   tooltip: "Print Content",
        //   exec: handlePrint,
        // },
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
    </div>
  );
};

export default memo(EditorComponent);
