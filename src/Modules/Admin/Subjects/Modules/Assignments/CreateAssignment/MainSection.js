import React, { useState } from "react";
import CreateAssignmentForm from "./Component/CreateAssignmentForm";
import CreateAssignmentHeader from "./Component/CreateAssignmentHeader";
import useCreateAssignment from "../../../../../../Hooks/AuthHooks/Staff/Admin/Assignment/createAssignment";
import { useParams } from "react-router-dom";
import EditorComponent from "../../../Component/AdminEditor";

const MainSection = () => {
  const [assignmentName, setAssignmentName] = useState("Monthly examination");
  const [editorContent, setEditorContent] = useState("");
  const {cid,sid} = useParams()
  const [formState, setFormState] = useState({
    points: "",
    displayGrade: "",
    submissionType: "",
    allowedAttempts: "",
    numberOfAttempts: "",
    assignTo: "",
    section: "",
    dueDate: "",
    availableFrom: "",
    until: "",
    thumbnail: null,
    moduleId: "",
    chapterId: "",
  });

  const { loading, error, success, createAssignment } = useCreateAssignment();

  const handleNameChange = (name) => {
    setAssignmentName(name);
  };

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (publish) => {
    const assignmentData = {
      name: assignmentName,
      content: editorContent,
      points: formState.points,
      grade: formState.displayGrade,
      submissionType: formState.submissionType,
      allowedAttempts: formState.allowedAttempts,
      allowNumberOfAttempts: formState.numberOfAttempts,
      assignTo: formState.assignTo,
      sectionId: formState.section,
      dueDate: formState.dueDate,
      availableFrom: formState.availableFrom,
      until: formState.until,
      thumbnail: formState.thumbnail,
      classId:cid,
      subjectId:sid,
      moduleId: formState.moduleId,
      chapterId: formState.chapterId,
      publish,
    };

    const result = await createAssignment(assignmentData);
    if (result.success) {
      console.log("Assignment created successfully:", result.data);
    }
  };

  return (
    <>
      <CreateAssignmentHeader onSave={handleSave} />
      <div className="flex w-full">
        <div className="w-[70%]">
          <EditorComponent
            assignmentLabel="Assignment Name"
            assignmentName={assignmentName}
            editorContent={editorContent}
            onNameChange={handleNameChange}
            onEditorChange={handleEditorChange}
          />
        </div>
        <div className="w-[30%]">
          <CreateAssignmentForm
            {...formState}
            setDisplayGrade={(grade) =>
              setFormState((prev) => ({ ...prev, displayGrade: grade }))
            }
            handleChange={handleFormChange}
          />
        </div>
      </div>
    </>
  );
};

export default MainSection;
