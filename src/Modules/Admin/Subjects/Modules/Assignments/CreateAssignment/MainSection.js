import React, { useState } from "react";
import CreateAssignmentForm from "./Component/CreateAssignmentForm";
import CreateAssignmentHeader from "./Component/CreateAssignmentHeader";
import useCreateAssignment from "../../../../../../Hooks/AuthHooks/Staff/Admin/Assignment/useCreateAssignment";
import EditorComponent from "../../../Component/Editor";

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
    thumbnail: null,
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

  const handleSave = async () => {
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
      thumbnail,
    } = formState;

    // if (
    //   assignmentName &&
    //   editorContent &&
    //   points &&
    //   displayGrade &&
    //   submissionType &&
    //   submissionFormat &&
    //   allowedAttempts &&
    //   numberOfAttempts &&
    //   assignTo &&
    //   section &&
    //   dueDate &&
    //   availableFrom &&
    //   until
    // ) {
      const assignmentData = {
        name: assignmentName,
        content: editorContent,
        points,
        grade: displayGrade,
        submissionType,
        submissionFormat,
        allowedAttempts,
        allowNumberOfAttempts: numberOfAttempts,
        assignTo,
        sectionId: section,
        dueDate,
        availableFrom,
        thumbnail,
        publish: true,
      };
      // await createAssignment(assignmentData);
      console.log(assignmentData);
    // } else {
    //   console.log("Please fill out all required fields.");
    // }
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
