import React, {
  memo,
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import JoditEditor from "jodit-react";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import useCloudinaryMediaUpload from "../../../../Hooks/CommonHooks/useCloudinaryMediaUpload";
import useCloudinaryDeleteByPublicId from "../../../../Hooks/CommonHooks/useCloudinaryDeleteByPublicId";

// Helpers to wrap uploads in HTML
function createImageWrapper(imageUrl, publicId) {
  const now = Date.now();
  return `
    <div class="uploaded-image-wrapper"
         data-public-id="${publicId}"
         data-uploaded-at="${now}"
         contenteditable="false"
         style="position: relative; display: inline-block; margin: 5px;">
      <img src="${imageUrl}" alt="Uploaded Image" style="max-width:100%; display:block; border-radius:8px;" />
      <button class="delete-btn"
              style="position: absolute; top: 5px; right: 5px; width:24px; height:24px; border-radius:50%; background: rgba(0,0,0,0.6); color: #fff; border: none; font-size:16px; line-height:24px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.3s;">
        &times;
      </button>
    </div>
  `;
}

function createFileWrapper(fileUrl, publicId) {
  const now = Date.now();
  return `
    <div class="uploaded-file-wrapper"
         data-public-id="${publicId}"
         data-uploaded-at="${now}"
         contenteditable="false"
         style="position: relative; display: inline-block; margin: 5px;">
      <a href="${fileUrl}" target="_blank" rel="noopener noreferrer"
         style="display: inline-flex; align-items: center; padding: 8px 16px; background-color: #C71585; color: #fff; border-radius: 4px; text-decoration: none; font-weight: bold;">
        📄 View PDF
      </a>
      <button class="delete-btn"
              style="position: absolute; top: 5px; right: 5px; width:24px; height:24px; border-radius:50%; background: rgba(0,0,0,0.6); color: #fff; border: none; font-size:16px; line-height:24px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.3s;">
        &times;
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
  nameError, // For Quiz Name validation
  contentError, // For Instructions validation
  inputRef,
}) => {
  const editor = useRef(null);
  const containerRef = useRef(null);

  const [scrollPosition, setScrollPosition] = useState(0);
  const processedDeletions = useRef(new Set());
  const uploadInProgress = useRef(false);

  const { uploadImage, uploadFile } = useCloudinaryMediaUpload();
  const { deleteMediaByPublicId } = useCloudinaryDeleteByPublicId();

  // ===================== PROGRESS BAR =====================
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
  // ===================== END PROGRESS BAR =====================

  // ===================== UPLOAD HANDLERS =====================
  const handleImageUpload = useCallback(
    async (file) => {
      if (!file) return;
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
        });
        if (response.secure_url && response.public_id) {
          const imgHTML = createImageWrapper(
            response.secure_url,
            response.public_id
          );
          editorInstance.selection.insertHTML(imgHTML);
          toast.success("Image Uploaded Successfully");
        } else {
          toast.error("Image upload failed. Missing data in response.");
        }
      } catch (error) {
        toast.error("Error uploading image. Please try again.");
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
      removeProgressBar,
      showProgressBar,
      updateProgressBar,
      scrollPosition,
    ]
  );

  const handleFileUpload = useCallback(
    async (file) => {
      if (!file) return;
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
        });
        if (response.secure_url && response.public_id) {
          const fileHTML = createFileWrapper(
            response.secure_url,
            response.public_id
          );
          editorInstance.selection.insertHTML(fileHTML);
          toast.success("PDF Uploaded Successfully");
        } else {
          toast.error("File upload failed. Missing data in response.");
        }
      } catch (error) {
        toast.error("Error uploading file. Please try again.");
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
      removeProgressBar,
      showProgressBar,
      updateProgressBar,
      scrollPosition,
    ]
  );

  const triggerImageUpload = useCallback(() => {
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
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/pdf";
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (file) handleFileUpload(file);
    };
    input.click();
  }, [handleFileUpload]);
  // ===================== END UPLOAD HANDLERS =====================

  // ===================== DELETION HANDLER =====================
  const handleDeleteClick = useCallback(
    async (e) => {
      if (e.target.classList.contains("delete-btn")) {
        e.stopPropagation();
        const wrapper =
          e.target.closest(".uploaded-image-wrapper") ||
          e.target.closest(".uploaded-file-wrapper");
        if (wrapper) {
          const publicId = wrapper.getAttribute("data-public-id");
          if (!publicId || processedDeletions.current.has(publicId)) return;

          const editorInstance = editor.current;
          let progressBarObj;
          if (editorInstance?.toolbar?.container) {
            progressBarObj = showProgressBar(
              editorInstance.toolbar.container.parentNode
            );
          }

          try {
            const data = await deleteMediaByPublicId(publicId);
            if (data.result === "ok") {
              if (progressBarObj)
                updateProgressBar(progressBarObj.progressBar, 100);
              processedDeletions.current.add(publicId);
              setTimeout(() => {
                if (progressBarObj) {
                  removeProgressBar(progressBarObj.progressBarContainer);
                }
                wrapper.remove();
              }, 500);
              toast.success("Asset deleted successfully");
            } else {
              if (progressBarObj)
                updateProgressBar(progressBarObj.progressBar, 100);
              setTimeout(() => {
                if (progressBarObj) {
                  removeProgressBar(progressBarObj.progressBarContainer);
                }
              }, 500);
              toast.error("Failed to delete asset");
            }
          } catch (error) {
            if (progressBarObj)
              updateProgressBar(progressBarObj.progressBar, 100);
            setTimeout(() => {
              if (progressBarObj) {
                removeProgressBar(progressBarObj.progressBarContainer);
              }
            }, 500);
            toast.error("Error deleting asset. Please try again.");
          }
        }
      }
    },
    [
      deleteMediaByPublicId,
      removeProgressBar,
      showProgressBar,
      updateProgressBar,
    ]
  );
  // ===================== END DELETION HANDLER =====================

  // Observe manual node removals to auto-delete from Cloudinary
  useEffect(() => {
    if (containerRef.current) {
      const observer = new MutationObserver((mutationsList) => {
        if (uploadInProgress.current) return;
        mutationsList.forEach((mutation) => {
          mutation.removedNodes.forEach((node) => {
            if (
              node.nodeType === 1 &&
              (node.classList.contains("uploaded-image-wrapper") ||
                node.classList.contains("uploaded-file-wrapper"))
            ) {
              const publicId = node.getAttribute("data-public-id");
              const uploadedAt = parseInt(
                node.getAttribute("data-uploaded-at"),
                10
              );
              if (publicId && !processedDeletions.current.has(publicId)) {
                const age = Date.now() - uploadedAt;
                // Only delete if the node was present for >3s
                if (age > 3000) {
                  deleteMediaByPublicId(publicId)
                    .then((data) => {
                      if (data.result === "ok") {
                        processedDeletions.current.add(publicId);
                        toast.success("Asset deleted (manual removal)");
                      } else {
                        toast.error("Failed to delete asset (manual removal)");
                      }
                    })
                    .catch(() => {
                      toast.error("Error deleting asset (manual removal)");
                    });
                }
              }
            }
          });
        });
      });
      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
      });
      return () => observer.disconnect();
    }
  }, [deleteMediaByPublicId]);

  // Jodit config
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
          if (containerRef.current) {
            containerRef.current.addEventListener("click", handleDeleteClick);
          }
        },
      },
    }),
    [isCreateQuestion, triggerImageUpload, triggerFileUpload, handleDeleteClick]
  );

  // Cleanup
  useEffect(() => {
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener("click", handleDeleteClick);
      }
    };
  }, [handleDeleteClick]);

  return (
    <div className="relative w-full bg-white mb-3 p-2">
      <Toaster />

      {/* If hideInput == false, show Quiz Name field */}
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
              className={`w-full p-2 border rounded-sm shadow-sm focus:outline-none focus:ring-1
                ${
                  nameError
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }
              `}
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

      {/* Editor container with red outline if contentError */}
      <div
        className={`${
          contentError
            ? "border border-red-500 rounded-sm p-1"
            : "border border-gray-300 rounded-sm p-1"
        }`}
      >
        <JoditEditor
          ref={editor}
          value={editorContent}
          config={config}
          tabIndex={1}
          onChange={(newContent) => onEditorChange(newContent)}
        />
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
