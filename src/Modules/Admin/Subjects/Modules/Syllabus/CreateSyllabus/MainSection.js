import React, { useState } from "react";
import CreateSyllabusHeader from "./Components/CreateSyllabusHeader";
import SideMenubar from "../../../../../../Components/Admin/SideMenubar";
import EditorComponent from "../../../Component/AdminEditor";
import { useParams } from "react-router-dom";
import useCreateSyllabus from "../../../../../../Hooks/AuthHooks/Staff/Admin/Syllabus/useCreateSyllabus";

const MainSection = () => {
  const [assignmentName, setAssignmentName] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const { loading, error, createSyllabus } = useCreateSyllabus();
  const { sid } = useParams();

  const handleNameChange = (name) => {
    setAssignmentName(name);
  };

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  const handleSave = async () => {
    const data = {
      title: assignmentName,
      content: editorContent,
      subjectId: sid,
    };

    await createSyllabus(data);
  };

  return (
    <div className="flex">
      <SideMenubar />
      <div className="w-full mb-4">
        <CreateSyllabusHeader onSave={handleSave} loading={loading} />
        <EditorComponent
          inputPlaceHolder="Syllabus Heading"
          assignmentLabel="Page Title"
          assignmentName={assignmentName}
          editorContent={editorContent}
          onNameChange={handleNameChange}
          onEditorChange={handleEditorChange}
        />
        {loading && <p role="status">Loading...</p>}
        {error && <p role="alert" className="text-red-400 text-current my-4">{error}</p>}
      </div>
    </div>
  );
};

export default MainSection;
