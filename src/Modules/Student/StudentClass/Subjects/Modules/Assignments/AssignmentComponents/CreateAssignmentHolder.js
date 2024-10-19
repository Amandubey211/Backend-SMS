import React, { useState } from "react";
import EditorComponent from "./Editor";
import MediaUpload from "./MediaUpload";
import TabButton from "./TabButton";

const CreateAssignmentHolder = ({ onSubmit }) => {
  const [editorContent, setEditorContent] = useState("");
  const [fileUrls, setFileUrls] = useState([]);
  const [activeTab, setActiveTab] = useState("Editor");

  const handleNext = () => {
    setActiveTab("MediaUpload");
  };

  const handleSubmit = () => {
    if (!editorContent && fileUrls.length === 0) {
      // Ensure some content or files exist before submission
      alert("Please add content or files before submitting");
      return;
    }
    // Pass the content and file URLs to the parent onSubmit handler
    onSubmit(editorContent, fileUrls);
  };

  return (
    <div className="w-full p-6 bg-gray-100 rounded-lg shadow-lg">
      <div className="flex gap-4 mb-4">
        <TabButton
          isActive={activeTab === "Editor"}
          onClick={() => setActiveTab("Editor")}
          className="flex-1"
        >
          Editor
        </TabButton>
        <TabButton
          isActive={activeTab === "MediaUpload"}
          onClick={() => setActiveTab("MediaUpload")}
          className="flex-1"
        >
          Media Upload
        </TabButton>
      </div>

      {activeTab === "Editor" && (
        <EditorComponent
          editorContent={editorContent}
          onEditorChange={setEditorContent}
          onNext={handleNext}
        />
      )}

      {activeTab === "MediaUpload" && (
        <>
          <MediaUpload onSubmit={setFileUrls} />
          <button
            onClick={handleSubmit} // Now handleSubmit will trigger with editorContent and fileUrls
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit Assignment
          </button>
        </>
      )}
    </div>
  );
};

export default CreateAssignmentHolder;
