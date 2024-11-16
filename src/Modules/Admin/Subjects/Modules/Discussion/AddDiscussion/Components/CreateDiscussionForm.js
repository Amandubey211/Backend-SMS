import React from "react";
import DateInput from "../../../../Component/DateInput";
import OptionRadios from "./OptionRadios";
import AssignToSection from "./AssignToSection";

const CreateDiscussionForm = ({
  assignTo,
  dueDate,
  availableFrom,
  availableUntil,
  sectionId,
  groupId,
  option,
  handleChange,
}) => {
  return (
    <div>
      {/* Radio options for threaded replies and post-before-seeing-replies */}
      {/* <OptionRadios option={option} handleChange={handleChange} /> */}

      {/* Section or Group assignment */}
      <AssignToSection
        assignTo={assignTo}
        sectionId={sectionId}
        handleChange={handleChange}
        groupId={groupId}
        isAssignToLabel={true}
      />

      {/* Date Inputs for availability, due date, and until */}
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
