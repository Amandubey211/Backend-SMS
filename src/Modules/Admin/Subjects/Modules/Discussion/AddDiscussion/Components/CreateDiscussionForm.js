import React from "react";
import DateInput from "../../../../Component/DateInput";
import AssignToSection from "./AssignToSection";

const CreateDiscussionForm = ({
  assignTo,
  dueDate,
  availableFrom,
  availableUntil,
  sectionId, // expected to be an array
  groupId, // expected to be an array
  option,
  handleChange,
  assignError, // error for assignment field
}) => {
  return (
    <div>
      <AssignToSection
        assignTo={assignTo}
        sectionId={sectionId}
        groupId={groupId}
        handleChange={handleChange}
        isAssignToLabel={true}
        error={assignError}
      />
      <DateInput
        label="Available from"
        name="availableFrom"
        value={availableFrom}
        handleChange={handleChange}
      />
      <DateInput
        label="Due"
        name="dueDate"
        value={dueDate}
        handleChange={handleChange}
      />
      <DateInput
        label="Until"
        name="availableUntil"
        value={availableUntil}
        handleChange={handleChange}
      />
    </div>
  );
};

export default CreateDiscussionForm;
