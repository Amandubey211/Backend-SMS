

// CreateAssignmentHolder.js
import React, { useState } from "react";
import Editor from "../../../Component/Editor";
import MediaUpload from "./MediaUpload";
import TabButton from "../../../../../../Admin/Libary/Subclasss/component/TabButton";
// TabButton
const CreateAssignmentHolder = ({ onSubmit }) => {
  const [editorContent, setEditorContent] = useState("");
  const [activeTab, setActiveTab] = useState("Editor");

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

      {activeTab === "Editor" && (
        <Editor
          assignmentLabel="Assignment Title"
          hideInput={false}
          editorContent={editorContent}
          onEditorChange={setEditorContent}
          onSubmit={onSubmit}
        />
      )}

      {activeTab === "MediaUpload" && <MediaUpload onSubmit={onSubmit} />}
    </>
  );
};

export default CreateAssignmentHolder;
