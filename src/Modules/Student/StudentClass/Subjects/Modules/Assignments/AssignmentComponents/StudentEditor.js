// StudentEditor.jsx

import React, {
  useRef,
  memo,
  useImperativeHandle,
  forwardRef,
  useMemo,
} from "react";
import JoditEditor from "jodit-react";
import { motion } from "framer-motion"; // Import Framer Motion
import { FaArrowRight } from "react-icons/fa"; // Import an icon from react-icons

const StudentEditor = forwardRef(
  ({ editorContent, onEditorChange, onNext, submissionType }, ref) => {
    const editor = useRef(null);

    // Jodit Editor Configuration
    const config = useMemo(() => {
      // Common configuration
      const baseConfig = {
        height: 400,
        spellcheck: true,
        showCharsCounter: true,
        showWordsCounter: true,
      };

      if (submissionType === "Online-textEntry") {
        // Configuration for Online-textEntry
        return {
          ...baseConfig,
          readonly: true, // Set editor to read-only
          toolbar: false, // Hide toolbar
          events: {
            afterInit: (editorInstance) => {
              editor.current = editorInstance;
              // Make inputs editable and attach necessary listeners
              makeInputsEditable(editorInstance);
            },
          },
        };
      } else {
        // Configuration for other submission types
        return {
          ...baseConfig,
          readonly: false, // Editor is editable
          toolbar: true, // Show toolbar
          toolbarSticky: true,
          toolbarAdaptive: false,
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
            },
          },
          uploader: {
            insertImageAsBase64URI: false,
          },
        };
      }
    }, [submissionType, onEditorChange]);

    // Function to make inputs editable for Online-textEntry
    const makeInputsEditable = (editorInstance) => {
      const inputFields =
        editorInstance.container.querySelectorAll(".blank-input");
      inputFields.forEach((input, index) => {
        input.removeAttribute("readonly");
        input.setAttribute("tabindex", 0);
        input.style.pointerEvents = "auto";
        input.style.userSelect = "auto";

        // Handle Tab navigation
        input.addEventListener("keydown", (e) => {
          e.stopPropagation();

          if (e.key === "Tab") {
            e.preventDefault();
            const shiftPressed = e.shiftKey;
            const inputs =
              editorInstance.container.querySelectorAll(".blank-input");
            let nextIndex;
            if (shiftPressed) {
              nextIndex = index - 1;
              if (nextIndex < 0) {
                nextIndex = inputs?.length - 1;
              }
            } else {
              nextIndex = index + 1;
              if (nextIndex >= inputs?.length) {
                nextIndex = 0;
              }
            }
            inputs[nextIndex].focus();
          }
        });
      });
    };

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      getFilledAnswers: () => {
        const editorInstance = editor.current;
        if (editorInstance && submissionType === "Online-textEntry") {
          const inputs =
            editorInstance.container.querySelectorAll(".blank-input");
          const answers = [];
          inputs.forEach((input) => {
            answers.push(input.value.trim());
          });
          return answers;
        }
        return [];
      },
      countTotalBlanks: () => {
        const editorInstance = editor.current;
        if (editorInstance && submissionType === "Online-textEntry") {
          const inputs =
            editorInstance.container.querySelectorAll(".blank-input");
          return inputs?.length;
        }
        return 0;
      },
      countFilledBlanks: () => {
        const editorInstance = editor.current;
        if (editorInstance && submissionType === "Online-textEntry") {
          const inputs =
            editorInstance.container.querySelectorAll(".blank-input");
          let filled = 0;
          inputs.forEach((input) => {
            if (input.value.trim() !== "") {
              filled++;
            }
          });
          return filled;
        }
        return 0;
      },
      getContentWithFilledAnswers: () => {
        const editorInstance = editor.current;
        if (editorInstance) {
          if (submissionType === "Online-textEntry") {
            const editorContainer = editorInstance.container;
            const clonedContent = editorContainer.cloneNode(true);

            // Replace inputs with their values
            const inputs = clonedContent.querySelectorAll(".blank-input");
            inputs.forEach((input) => {
              const value = input.value.trim() || "________"; // Placeholder for empty answers
              const textNode = document.createTextNode(value);
              input.parentNode.replaceChild(textNode, input);
            });

            // Return the inner HTML of the editor's content area
            const contentArea = clonedContent.querySelector(".jodit-wysiwyg");
            return contentArea.innerHTML;
          } else {
            // For other submission types, return the editor content
            return editorInstance.value;
          }
        }
        return "";
      },
    }));

    return (
      <div className="relative w-full bg-white p-2">
        <JoditEditor
          ref={editor}
          value={editorContent}
          config={config}
          tabIndex={1}
        />

        {/* Next Button visible for all submission types */}
        <div className="flex justify-end">
          <motion.button
            onClick={onNext}
            className="mt-2 px-6 py-2 flex items-center justify-center text-white font-medium rounded-md shadow-sm bg-gradient-to-r from-pink-500 to-pink-700 hover:from-pink-600 hover:to-pink-800 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Next
            <FaArrowRight className="ml-2 w-5 h-5" />
          </motion.button>
        </div>

        <style jsx>{`
          .editable-blank {
            display: block;
            margin: 0 2px;
          }

          .blank-input {
            border: none;
            margin-top: 15px;
            border-bottom: 2px solid #c71585;
            outline: none;
            background-color: transparent;
            text-align: start;
            width: 50%;
            max-width: 100%;
            height: auto;
            transition: border-color 0.3s, background-color 0.3s;
            pointer-events: auto;
            user-select: auto;
          }

          .blank-input:focus {
            border-color: #a50b5e;
            background-color: #fff0f5;
          }

          .non-editable {
            user-select: none;
            pointer-events: none;
          }

          button:active {
            transform: scale(0.98);
          }
        `}</style>
      </div>
    );
  }
);

export default memo(StudentEditor);
