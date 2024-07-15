import React, { useState } from "react";
import CreateAssignmentForm from "./Component/CreateAssignmentForm";
import CreateAssignmentHeader from "./Component/CreateAssignmentHeader";
import Editor from "../../../Component/Editor";

const MainSection = () => {
  const [assignmentName, setAssignmentName] = useState("Monthly examination");
  const [editorContent, setEditorContent] = useState("");
  const [formState, setFormState] = useState({
    points: "",
    displayGrade: "",
    submissionType: "",
    submissionFormat: "",
    allowedAttempts: "",
    numberOfAttempts: "",
    assignTo: "",
    section: "",
    dueDate: "",
    availableFrom: "",
    until: "",
  });

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

  const handleSave = () => {
    const {
      points,
      displayGrade,
      submissionType,
      submissionFormat,
      allowedAttempts,
      numberOfAttempts,
      assignTo,
      section,
      dueDate,
      availableFrom,
      until,
    } = formState;

    if (
      assignmentName &&
      editorContent &&
      points &&
      displayGrade &&
      submissionType &&
      submissionFormat &&
      allowedAttempts &&
      numberOfAttempts &&
      assignTo &&
      section &&
      dueDate &&
      availableFrom &&
      until
    ) {
      console.log("Assignment Name:", assignmentName);
      console.log("Editor Content:", editorContent);
      console.log("Form Data:", formState);
    } else {
      console.log("Please fill out all required fields.");
    }
  };

  return (
    <>
      <CreateAssignmentHeader onSave={handleSave} />
      <div className="flex w-full">
        <div className="w-[70%]">
          <Editor
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
            setSubmissionFormat={(format) =>
              setFormState((prev) => ({ ...prev, submissionFormat: format }))
            }
            handleChange={handleFormChange}
          />
        </div>
      </div>
    </>
  );
};

export default MainSection;
