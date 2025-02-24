import React from "react";
import EditorComponent from "../../../../Component/AdminEditor";

const QuizInstructions = ({
  assignmentName,
  instruction,
  handleNameChange,
  handleInstructionChange,
  nameError,
  contentError,
}) => (
  <EditorComponent
    assignmentLabel="Quiz Name"
    assignmentName={assignmentName}
    editorContent={instruction}
    onNameChange={handleNameChange}
    onEditorChange={handleInstructionChange}
    // these two lines ensure the scroll/focus works:
    nameError={nameError}
    contentError={contentError}
  />
);

export default QuizInstructions;
