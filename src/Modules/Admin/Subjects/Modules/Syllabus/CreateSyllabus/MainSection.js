import React, { useState } from "react";
import CreateSyllabusHeader from "./Components/CreateSyllabusHeader";
import SideMenubar from "../../../../../../Components/Admin/SideMenubar";
import Editor from "../../../Component/Editor";

const MainSection = () => {
  const [assignmentName, setAssignmentName] = useState("");
  const [editorContent, setEditorContent] = useState("");

  const handleNameChange = (name) => {
    setAssignmentName(name);
  };

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };
  const handleSave = () => [console.log(assignmentName, editorContent)];

  return (
    <div className="flex">
      <SideMenubar />
      <div className="w-full">
        <CreateSyllabusHeader onSave={handleSave} />
        <Editor
          assignmentLabel="Page Title"
          assignmentName={assignmentName}
          editorContent={editorContent}
          onNameChange={handleNameChange}
          onEditorChange={handleEditorChange}
        />
      </div>
    </div>
  );
};

export default MainSection;
