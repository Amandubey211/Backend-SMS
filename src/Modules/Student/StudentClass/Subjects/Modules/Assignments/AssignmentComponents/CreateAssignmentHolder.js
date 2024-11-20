import React, { useState, useEffect } from "react";
import EditorComponent from "./Editor";
import MediaUpload from "./MediaUpload"; // Assuming you have this component
import TabButton from "./TabButton"; // Assuming you have this component
import toast from "react-hot-toast";
import { useSelector } from "react-redux"; // If you're using Redux
import DOMPurify from "dompurify";
const CreateAssignmentHolder = ({ onSubmit }) => {
  // Fetch assignment data from Redux store or props
  const { assignmentData } = useSelector(
    (store) => store?.student?.studentAssignment
  );

  const [editorContent, setEditorContent] = useState("");
  const [fileUrls, setFileUrls] = useState([]);
  const [activeTab, setActiveTab] = useState("Editor");

  useEffect(() => {
    if (assignmentData?.submissionType === "Online-textEntry") {
      // Process content to make only blanks editable
      const processed = processTextEntryContent(assignmentData.content);
      setEditorContent(processed); // Initialize editorContent with processed content
    } else {
      // For other submission types, use empty content
      setEditorContent(""); // Initialize editorContent as empty
    }
  }, [assignmentData]);

  const handleNext = () => {
    setActiveTab("MediaUpload");
  };

  const handleFinalSubmit = () => {
    if (
      (assignmentData?.submissionType === "Online-textEntry" &&
        !getFilledBlanks(editorContent)) ||
      (assignmentData?.submissionType !== "Online-textEntry" &&
        !editorContent &&
        fileUrls.length === 0)
    ) {
      // Ensure some content or files exist before submission
      toast.error("Please fill in the blanks or add files before submitting");
      return;
    }

    if (assignmentData?.submissionType === "Online-textEntry") {
      // Extract filled-in answers
      const answers = extractAnswers(editorContent);
      onSubmit(answers, fileUrls);
    } else {
      // Pass the content and file URLs to the parent onSubmit handler
      onSubmit(editorContent, fileUrls);
    }
  };

  // Function to process content for 'Online-textEntry'
  const processTextEntryContent = (rawContent) => {
    // Split the content by "____" to identify blanks
    const parts = rawContent.split(/____/g);
    let counter = 1;
    let processed = "";

    parts.forEach((part, index) => {
      // Sanitize the non-blank text
      const sanitizedPart = DOMPurify?.sanitize(part);

      // Wrap non-blank text in non-editable spans
      if (sanitizedPart.trim() !== "") {
        processed += `<span class="non-editable">${sanitizedPart}</span>`;
      }

      // After each part except the last, add an editable blank
      if (index < parts.length - 1) {
        processed += `<span class="editable-blank" data-blank="true" data-id="blank-${counter}">____</span>`;
        counter += 1;
      }
    });

    return processed;
  };

  // Function to extract filled-in answers from the editor content
  const extractAnswers = (content) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const blanks = doc.querySelectorAll(".editable-blank");
    const answers = [];

    blanks.forEach((blank) => {
      answers.push(blank.textContent.trim());
    });

    return answers;
  };

  // Function to check if all blanks are filled
  const getFilledBlanks = (content) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const blanks = doc.querySelectorAll(".editable-blank");

    for (let blank of blanks) {
      if (
        blank.textContent.trim() === "____" ||
        blank.textContent.trim() === ""
      ) {
        return false;
      }
    }

    return true;
  };

  return (
    <div className="w-full  h-screen overflow-y-auto">
      {/* Tabs for switching between Editor and Media Upload */}
      <div className="flex gap-4 mb-2 " role="tablist">
        <TabButton
          isActive={activeTab === "Editor"}
          onClick={() => setActiveTab("Editor")}
          className="flex-1"
          aria-selected={activeTab === "Editor"}
          role="tab"
        >
          Editor
        </TabButton>
        <TabButton
          isActive={activeTab === "MediaUpload"}
          onClick={() => setActiveTab("MediaUpload")}
          className="flex-1"
          aria-selected={activeTab === "MediaUpload"}
          role="tab"
        >
          Media Upload
        </TabButton>
      </div>

      {/* Conditional Rendering */}
      {activeTab === "Editor" && (
        <div>
          <EditorComponent
            editorContent={editorContent}
            onEditorChange={setEditorContent}
            onNext={handleNext}
            isCreateQuestion={false}
            submissionType={assignmentData?.submissionType}
          />
        </div>
      )}

      {activeTab === "MediaUpload" && (
        <div>
          <MediaUpload onSubmit={setFileUrls} />
          <button
            onClick={handleFinalSubmit}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit Assignment
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateAssignmentHolder;
