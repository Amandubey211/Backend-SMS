import React, { memo, useState, useRef, useCallback, useMemo, useEffect } from "react";
import JoditEditor from "jodit-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import useCloudinaryMediaUpload from "../../../../Hooks/CommonHooks/useCloudinaryMediaUpload";
import useCloudinaryDeleteByPublicId from "../../../../Hooks/CommonHooks/useCloudinaryDeleteByPublicId";

// Helper to wrap uploaded images in HTML
function createImageWrapper(imageUrl, publicId) {
  const now = Date.now();
  return `
    <div class="uploaded-image-wrapper"
         data-public-id="${publicId}"
         data-uploaded-at="${now}"
         contenteditable="false"
         style="position: relative; display: inline-block; margin: 5px;">
      <img src="${imageUrl}" alt="Uploaded Image" style="max-width:100%; display:block; border-radius:8px;" />
      <button type="button" class="delete-btn"
              style="position: absolute; top: 5px; right: 5px; width:24px; height:24px; border-radius:50%; background: rgba(0,0,0,0.6); color: #fff; border: none; font-size:16px; line-height:24px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.3s;">
        ×
      </button>
    </div>
  `;
}

// Helper to wrap uploaded files (PDFs) in HTML
function createFileWrapper(fileUrl, publicId) {
  const now = Date.now();
  return `
    <div class="uploaded-file-wrapper"
         data-public-id="${publicId}"
         data-uploaded-at="${now}"
         contenteditable="false"
         style="position: relative; display:flex; margin: 5px; align-items:center; gap:2px;">
      <a href="${fileUrl}" target="_blank" rel="noopener noreferrer"
         style="display: inline-flex; align-items: center; padding: 8px 16px; background-color: #C71585; color: #fff; border-radius: 4px; text-decoration: none; font-weight: bold;">
        📄 View PDF
      </a>
      <button type="button" class="delete-btn"
              style="width:20px; height:20px; border-radius:50%; background: rgba(0,0,0,0.6); color: #fff; border: none; font-size:18px; line-height:24px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.3s;">
        ×
      </button>
    </div>
  `;
}

const EditorComponent = ({
  assignmentLabel,
  hideInput,
  assignmentName,
  editorContent,
  onNameChange,
  onEditorChange,
  inputPlaceHolder,
  isCreateQuestion,
  nameError,
  contentError,
  inputRef,
  readOnly,
}) => {
  const editor = useRef(null);
  const containerRef = useRef(null);
  const lastDeleteTimeRef = useRef(0);
  const toastActions = useRef(new Set());
  const [scrollPosition, setScrollPosition] = useState(0);
  const processedDeletions = useRef(new Set());
  const uploadInProgress = useRef(false);

  const { uploadImage, uploadFile } = useCloudinaryMediaUpload();
  const { deleteMediaByPublicId } = useCloudinaryDeleteByPublicId();

  const showToast = useCallback((message, type = "success", actionId) => {
    if (toastActions.current.has(actionId)) return;
    toastActions.current.add(actionId);
    if (type === "success") {
      toast.success(message);
    } else {
      toast.error(message);
    }
  }, []);

  const showProgressBar = useCallback((parentElement) => {
    const container = document.createElement("div");
    container.style.position = "relative";
    container.style.width = "100%";
    container.style.height = "5px";
    container.style.backgroundColor = "#f0f0f0";

    const bar = document.createElement("div");
    bar.style.width = "0%";
    bar.style.height = "100%";
    bar.style.backgroundColor = "#C71585";
    bar.style.transition = "width 0.3s";

    container.appendChild(bar);
    parentElement.appendChild(container);

    return { progressBar: bar, progressBarContainer: container };
  }, []);

  const updateProgressBar = useCallback((progressBar, percentage) => {
    if (progressBar) {
      progressBar.style.width = `${percentage}%`;
    }
  }, []);

  const removeProgressBar = useCallback((progressBarContainer) => {
    if (progressBarContainer?.parentNode) {
      progressBarContainer.parentNode.removeChild(progressBarContainer);
    }
  }, []);

  const handleImageUpload = useCallback(
    async (file) => {
      if (!file) return;
      const actionId = `image-upload-${Date.now()}-${file.name}`;
      const editorInstance = editor.current;
      let progressBarObj;
      setScrollPosition(window.scrollY);
      uploadInProgress.current = true;
      if (editorInstance?.toolbar?.container) {
        progressBarObj = showProgressBar(
          editorInstance.toolbar.container.parentNode
        );
      }
      try {
        const response = await uploadImage(file, (e) => {
          const pct = Math.round((e.loaded * 100) / e.total);
          if (progressBarObj)
            updateProgressBar(progressBarObj.progressBar, pct);
        }, "editor-contents");
        if (response.secure_url && response.public_id) {
          const imgHTML = createImageWrapper(
            response.secure_url,
            response.public_id
          );
          editorInstance.selection.insertHTML(imgHTML);
          showToast("Image Uploaded Successfully", "success", actionId);
        } else {
          showToast(
            "Image upload failed. Missing data in response.",
            "error",
            actionId
          );
        }
      } catch (error) {
        showToast("Error uploading image. Please try again.", "error", actionId);
      } finally {
        if (progressBarObj) {
          removeProgressBar(progressBarObj.progressBarContainer);
        }
        window.scrollTo(0, scrollPosition);
        uploadInProgress.current = false;
      }
    },
    [
      uploadImage,
      updateProgressBar,
      removeProgressBar,
      showProgressBar,
      scrollPosition,
      showToast,
    ]
  );

  const handleFileUpload = useCallback(
    async (file) => {
      if (!file) return;
      const actionId = `file-upload-${Date.now()}-${file.name}`;
      const editorInstance = editor.current;
      let progressBarObj;
      setScrollPosition(window.scrollY);
      uploadInProgress.current = true;
      if (editorInstance?.toolbar?.container) {
        progressBarObj = showProgressBar(
          editorInstance.toolbar.container.parentNode
        );
      }
      try {
        const response = await uploadFile(file, (e) => {
          const pct = Math.round((e.loaded * 100) / e.total);
          if (progressBarObj)
            updateProgressBar(progressBarObj.progressBar, pct);
        }, "editor-contents");
        if (response.secure_url && response.public_id) {
          const fileHTML = createFileWrapper(
            response.secure_url,
            response.public_id
          );
          editorInstance.selection.insertHTML(fileHTML);
          showToast("PDF Uploaded Successfully", "success", actionId);
        } else {
          showToast(
            "File upload failed. Missing data in response.",
            "error",
            actionId
          );
        }
      } catch (error) {
        showToast("Error uploading file. Please try again.", "error", actionId);
      } finally {
        if (progressBarObj) {
          removeProgressBar(progressBarObj.progressBarContainer);
        }
        window.scrollTo(0, scrollPosition);
        uploadInProgress.current = false;
      }
    },
    [
      uploadFile,
      updateProgressBar,
      removeProgressBar,
      showProgressBar,
      scrollPosition,
      showToast,
    ]
  );

  const triggerImageUpload = useCallback(() => {
    const actionId = `trigger-image-${Date.now()}`;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (file) handleImageUpload(file);
    };
    input.click();
  }, [handleImageUpload]);

  const triggerFileUpload = useCallback(() => {
    const actionId = `trigger-file-${Date.now()}`;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/pdf";
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (file) handleFileUpload(file);
    };
    input.click();
  }, [handleFileUpload]);

  const handleDeleteClick = useCallback(
    async (e) => {
      if (
        e.target.nodeName !== "BUTTON" ||
        !e.target.classList.contains("delete-btn")
      )
        return;
      const now = Date.now();
      if (now - lastDeleteTimeRef.current < 500) return;
      lastDeleteTimeRef.current = now;

      e.stopPropagation();
      e.preventDefault();

      const wrapper =
        e.target.closest(".uploaded-image-wrapper") ||
        e.target.closest(".uploaded-file-wrapper");
      if (wrapper) {
        const publicId = wrapper.getAttribute("data-public-id");
        if (!publicId || processedDeletions.current.has(publicId)) return;

        const actionId = `delete-${publicId}-${now}`;
        const editorInstance = editor.current;
        let progressBarObj;
        if (editorInstance?.toolbar?.container) {
          progressBarObj = showProgressBar(
            editorInstance.toolbar.container.parentNode
          );
        }

        try {
          const data = await deleteMediaByPublicId(publicId);
          if (data.result === "ok" || data.result === "not found") {
            if (progressBarObj)
              updateProgressBar(progressBarObj.progressBar, 100);
            processedDeletions.current.add(publicId);
            setTimeout(() => {
              if (progressBarObj) {
                removeProgressBar(progressBarObj.progressBarContainer);
              }
              wrapper.remove();
              const newContent = editorInstance.getEditorValue();
              onEditorChange(newContent);
            }, 500);
            showToast(
              data.result === "ok"
                ? "Asset deleted successfully"
                : "Asset not found on Cloudinary, removed locally",
              "success",
              actionId
            );
          } else {
            if (progressBarObj)
              updateProgressBar(progressBarObj.progressBar, 100);
            setTimeout(() => {
              if (progressBarObj) {
                removeProgressBar(progressBarObj.progressBarContainer);
              }
            }, 500);
            showToast("Failed to delete asset", "error", actionId);
          }
        } catch (error) {
          console.error(`Error deleting asset: ${error}`);
          if (progressBarObj)
            updateProgressBar(progressBarObj.progressBar, 100);
          setTimeout(() => {
            if (progressBarObj) {
              removeProgressBar(progressBarObj.progressBarContainer);
            }
          }, 500);
          showToast("Error deleting asset. Please try again.", "error", actionId);
        }
      }
    },
    [
      deleteMediaByPublicId,
      showProgressBar,
      updateProgressBar,
      removeProgressBar,
      showToast,
      onEditorChange,
    ]
  );

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.addEventListener("click", handleDeleteClick);
      return () =>
        containerRef.current.removeEventListener("click", handleDeleteClick);
    }
  }, [handleDeleteClick]);

  const config = useMemo(
    () => ({
      readonly: readOnly,
      height: isCreateQuestion ? 300 : 400,
      spellcheck: true,
      toolbarSticky: true,
      toolbarAdaptive: false,
      showCharsCounter: true,
      showWordsCounter: true,
      showXPathInStatusbar: false,
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      showPoweredByJodit: false,
      disablePlugins: ["about"],
      removeButtons: ["about", "source"],
      contentStyle:
        "white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word;",
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
        {
          name: "image",
          tooltip: "Upload Image",
          exec: triggerImageUpload,
        },
        {
          name: "file",
          tooltip: "Upload File (PDF)",
          exec: triggerFileUpload,
        },
        "video",
        "link",
        "preview",
        "fullsize",
        "print",
      ],
      events: {
        afterInit: (editorInstance) => {
          editor.current = editorInstance;
          containerRef.current = editorInstance.container;
          // Initial focus without resetting cursor
          if (!readOnly) editorInstance.focus();
        },
      },
    }),
    [isCreateQuestion, triggerImageUpload, triggerFileUpload, readOnly]
  );

  // Preserve cursor position during content updates
  useEffect(() => {
    const editorInstance = editor.current;
    if (editorInstance && !readOnly) {
      const selection = editorInstance.selection;
      if (selection) {
        selection.save(); // Save the current cursor position
        editorInstance.setEditorValue(editorContent); // Update content
        selection.restore(); // Restore the cursor position
        editorInstance.focus(); // Ensure focus is maintained
      }
    }
  }, [editorContent, readOnly]);

  return (
    <div className="relative w-full bg-white mb-3 p-2">
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
              ref={inputRef}
              className={`w-full p-2 border rounded-sm shadow-sm focus:outline-none focus:ring-1 ${nameError
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
                }`}
              spellCheck="true"
            />
            {nameError && (
              <motion.p
                className="text-red-500 text-sm mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {nameError}
              </motion.p>
            )}
          </div>
        </div>
      )}
      <div
        className={`${contentError ? "border border-red-500 rounded-sm p-1" : ""}`}
      >
        {readOnly ? (
          <JoditEditor
            ref={editor}
            value={editorContent}
            config={config}
            tabIndex={1}
          />
        ) : (
          <JoditEditor
            ref={editor}
            value={editorContent}
            config={config}
            tabIndex={1}
            onChange={onEditorChange}
          />
        )}
      </div>
      {contentError && (
        <motion.p
          className="text-red-500 text-sm mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {contentError}
        </motion.p>
      )}
    </div>
  );
};

export default memo(EditorComponent);