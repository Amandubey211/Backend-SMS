import React, { useState } from "react";
import EditorComponent from "./Editor";
import MediaUpload from "./MediaUpload";
import TabButton from "./TabButton";
import { toast } from "react-hot-toast";
import { baseUrl } from "../../../../../../../config/Common";

const CreateAssignmentHolder = ({
  onSubmit,
  assignmentId,
  isReattempt = false,
}) => {
  const [editorContent, setEditorContent] = useState("");
  const [fileUrls, setFileUrls] = useState([]);
  const [activeTab, setActiveTab] = useState("Editor");
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const handleNext = () => {
    setActiveTab("MediaUpload"); // Transition to Media Upload
    console.log("Transitioning to Media Upload Tab");
  };

  const handleFormSubmit = async () => {
    setSubmitAttempted(true); // Indicate a submit attempt was made

    if (!editorContent && !fileUrls.length) {
      toast.error(
        "Please add some content on Editor or upload files before submitting."
      );
      return;
    }

    const token = localStorage.getItem("student:token");
    if (!token) {
      toast.error("Authentication token not found");
      console.error("Authentication token not found");
      return;
    }

    const submissionData = {
      content: editorContent,
      media: fileUrls,
      type: "Media Upload",
      comment: "No comments", // This can be adapted to include actual comments if needed
    };

    console.log("Submitting with data:", submissionData);

    const url = isReattempt
      ? `${baseUrl}/student/studentAssignment/reattempt/${assignmentId}`
      : `${baseUrl}/student/studentAssignment/submit/${assignmentId}`;

    try {
      const response = await fetch(url, {
        method: isReattempt ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authentication: token,
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();
      console.log("Response:", data);

      if (response.ok && data.success) {
        toast.success("Assignment submitted successfully");
        //onSubmit && onSubmit(); // Optional callback
      } else {
        toast.error(data.message || "Failed to submit assignment");
        console.error("Failed to submit assignment with response:", data);
      }
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error("Submission failed: " + error.message);
    }
  };

  return (
    <>
      <div className="flex gap-4 mb-4">
        <TabButton
          isActive={activeTab === "Editor"}
          onClick={() => setActiveTab("Editor")}
        >
          Editor
        </TabButton>
        <TabButton
          isActive={activeTab === "MediaUpload"}
          onClick={() => setActiveTab("MediaUpload")}
        >
          Media Upload
        </TabButton>
      </div>

      {/* {activeTab === "Editor" && (
        <EditorComponent
          editorContent={editorContent}
          onEditorChange={setEditorContent}
          onNext={handleNext}
        />
      )} */}

      {activeTab === "MediaUpload" && (
        <>
          <MediaUpload onSubmit={setFileUrls} />

          <button
            onClick={handleFormSubmit}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            // disabled={!editorContent || !fileUrls.length}
          >
            Submit Assignment
          </button>
          {submitAttempted && !editorContent && !fileUrls.length && (
            <p className="text-red-500">
              Please write something or upload a file to submit.
            </p>
          )}
        </>
      )}

      {/* <button
        onClick={handleFormSubmit}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={!editorContent || !fileUrls.length}
      >
        Submit Assignment
      </button> */}
    </>
  );
};

export default CreateAssignmentHolder;
