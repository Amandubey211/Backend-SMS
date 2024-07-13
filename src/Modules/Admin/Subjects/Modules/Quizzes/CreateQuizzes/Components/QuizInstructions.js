import React from "react";
import EditorComponent from "../../../../Component/AdminEditor";

const QuizInstructions = ({ assignmentName, instruction, handleNameChange, handleInstructionChange }) => (
  <EditorComponent
    assignmentLabel="Quiz Name"
    assignmentName={assignmentName}
    editorContent={instruction}
    onNameChange={handleNameChange}
    onEditorChange={handleInstructionChange}
  />
);

export default QuizInstructions;
