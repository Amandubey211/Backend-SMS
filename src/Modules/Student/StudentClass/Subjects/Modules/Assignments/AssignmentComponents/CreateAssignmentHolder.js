// CreateAssignmentHolder.jsx

import React, { useState, useEffect, useRef } from "react";
import MediaUpload from "./MediaUpload";
import TabButton from "./TabButton";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { stdDoAssignment } from "../../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Assignment/assignment.action";
import StudentEditor from "./StudentEditor";
import DOMPurify from "dompurify";
import { motion, AnimatePresence } from "framer-motion";
import { FaInfoCircle, FaCheck, FaTimes } from "react-icons/fa";

const CreateAssignmentHolder = ({ isSubmitted, onClose }) => {
  const dispatch = useDispatch();
  const { assignmentData } = useSelector(
    (store) => store?.student?.studentAssignment
  );

  // console.log("aaaaaaaaaa===>",assignmentData)

  const [editorContent, setEditorContent] = useState("");
  const [fileUrls, setFileUrls] = useState([]);
  const [activeTab, setActiveTab] = useState("Editor");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationData, setConfirmationData] = useState({});

  const isEditorContentInitialized = useRef(false);
  const studentEditorRef = useRef(null);

  useEffect(() => {
    if (!isEditorContentInitialized.current) {
      if (assignmentData?.submissionType === "Online-textEntry") {
        // Process content to make only blanks editable
        const processed = processTextEntryContent(assignmentData.content);
        setEditorContent(processed);
      } else {
        // For other submission types, initialize with empty content
        setEditorContent("");
      }
      isEditorContentInitialized.current = true;
    }
  }, [assignmentData]);

  const handleNext = () => {
    if (assignmentData?.submissionType === "Online-textEntry") {
      // Prepare data for the confirmation modal
      const totalBlanks = studentEditorRef.current.countTotalBlanks();
      const filledBlanks = studentEditorRef.current.countFilledBlanks();
      const leftBlanks = totalBlanks - filledBlanks;

      const confirmationInfo = {
        totalBlanks,
        filledBlanks,
        leftBlanks,
      };

      setConfirmationData(confirmationInfo);
      setShowConfirmationModal(true);
    } else {
      // For other submission types, proceed to MediaUpload tab
      setActiveTab("MediaUpload");
    }
  };

  const handleFinalSubmit = () => {
    if (assignmentData?.submissionType === "Online-textEntry") {
      // Submission is handled via the confirmation modal after clicking "Next"
      // So we don't need to handle anything here for "Online-textEntry"
    } else {
      // For other submission types, submit directly
      confirmSubmit();
    }
  };

  const confirmSubmit = async () => {
    if (showConfirmationModal) {
      setShowConfirmationModal(false);
    }
    try {
      setIsSubmitting(true);
      let contentToSubmit = editorContent;

      if (
        assignmentData?.submissionType === "Online-textEntry" &&
        studentEditorRef.current
      ) {
        // Get content with filled answers
        contentToSubmit =
          studentEditorRef.current.getContentWithFilledAnswers();
      } else {
        // For other submission types, use editorContent directly
        contentToSubmit = editorContent;
      }

      await submitAssignment(contentToSubmit, fileUrls);
      setIsSubmitting(false);
      toast.success("Assignment submitted successfully");
      onClose();
    } catch (error) {
      setIsSubmitting(false);
      toast.error(error?.message || "Error submitting assignment");
    }
  };

  const submitAssignment = async (submissionContent, submissionFiles) => {
    // Sanitize the content before sending
    const sanitizedContent = DOMPurify.sanitize(submissionContent);

    await dispatch(
      stdDoAssignment({
        assignmentId: assignmentData?._id,
        editorContent: sanitizedContent,
        fileUrls: submissionFiles,
        type: assignmentData?.submissionType,
        isReattempt: isSubmitted,
      })
    );
  };

  // Helper function to process content for Online-textEntry
  const processTextEntryContent = (rawContent) => {
    const parts = rawContent.split(/____/g);
    let counter = 1;
    let processed = "";

    parts.forEach((part, index) => {
      const sanitizedPart = DOMPurify?.sanitize(part);

      if (sanitizedPart.trim() !== "") {
        processed += `<span class="non-editable" contenteditable="false" aria-hidden="true">${sanitizedPart}</span>`;
      }

      if (index < parts?.length - 1) {
        processed += `<span class="editable-blank" data-blank="true" data-id="blank-${counter}">
                        <input type="text" class="blank-input" placeholder="Fill in..." aria-label="Fill in the blank" />
                      </span>`;
        counter += 1;
      }
    });

    return processed;
  };

  return (
    <div className="w-full h-screen overflow-y-auto ps-4">
      {/* Tabs for switching between Editor and Media Upload */}
      <div className="flex gap-4 my-2" role="tablist">
        <TabButton
          isActive={activeTab === "Editor"}
          onClick={() => setActiveTab("Editor")}
          className="flex-1"
          aria-selected={activeTab === "Editor"}
          role="tab"
        >
          Editor
        </TabButton>
        {assignmentData?.submissionType !== "Online-textEntry" && (
          <TabButton
            isActive={activeTab === "MediaUpload"}
            onClick={() => setActiveTab("MediaUpload")}
            className="flex-1"
            aria-selected={activeTab === "MediaUpload"}
            role="tab"
          >
            Media Upload
          </TabButton>
        )}
      </div>

      {/* Render components based on activeTab */}
      {activeTab === "Editor" && (
        <div>
          <StudentEditor
            ref={studentEditorRef}
            editorContent={editorContent}
            onEditorChange={setEditorContent}
            onNext={handleNext}
            submissionType={assignmentData?.submissionType}
          />
        </div>
      )}

      {activeTab === "MediaUpload" && (
        <div className="mb-4">
          <MediaUpload onSubmit={setFileUrls} initialFiles={fileUrls} />
          <div className="mt-4">
            <label className="flex items-start space-x-2">
              <input
                type="checkbox"
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="text-sm text-gray-700">
                I confirm that this assignment is my original work and has been
                completed independently. I understand that submitting
                plagiarized or incomplete work may result in a reduced grade or
                other consequences as outlined by my teacher.
              </span>
            </label>
          </div>
          <button
            onClick={handleFinalSubmit}
            className={`mt-4 px-4 py-2 rounded-md text-white ${
              isConfirmed
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            disabled={!isConfirmed || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Assignment"}
          </button>
        </div>
      )}

      {/* Confirmation Modal - only when showConfirmationModal is true */}
      <AnimatePresence>
        {showConfirmationModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black opacity-50"
              onClick={() => setShowConfirmationModal(false)}
            ></div>
            {/* Modal Content */}
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg z-10 max-w-sm w-full mx-4"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center mb-4">
                <FaInfoCircle className="text-pink-500 w-6 h-6 mr-2" />
                <h2 className="text-xl font-semibold">Confirm Submission</h2>
              </div>
              <div className="text-gray-700">
                <p className="mb-2">
                  <span className="font-medium">Total Blanks:</span>{" "}
                  {confirmationData.totalBlanks}
                </p>
                <p className="mb-2">
                  <span className="font-medium">Filled Blanks:</span>{" "}
                  {confirmationData.filledBlanks}
                </p>
                <p className="mb-4">
                  <span className="font-medium">Left Blanks:</span>{" "}
                  {confirmationData.leftBlanks}
                </p>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <motion.button
                  onClick={() => {
                    setShowConfirmationModal(false);
                  }}
                  className="px-4 py-2 flex items-center rounded-md bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaTimes className="mr-2 w-4 h-4" />
                  Cancel
                </motion.button>
                <motion.button
                  onClick={confirmSubmit}
                  className="px-4 py-2 flex items-center rounded-md bg-pink-500 text-white hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaCheck className="mr-2 w-4 h-4" />
                  Confirm
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateAssignmentHolder;
