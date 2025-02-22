import React from "react";
import AssignToRadios from "../../../../Component/AssignToRadios";
import SectionSelect from "../../../../Component/SectionSelect";

const AssignToSection = ({
  assignTo,
  sectionId,
  groupId,
  handleChange,
  assignTitle,
  isAssignToLabel,
}) => {
  return (
    <div className="mt-5">
      <AssignToRadios
        assignTo={assignTo}
        handleChange={handleChange}
        isAssignToLabel={isAssignToLabel}
        title={assignTitle}
      />

      <SectionSelect
        assignTo={assignTo}
        sectionId={sectionId}
        groupId={groupId}
        handleChange={handleChange}
      />
    </div>
  );
};

export default AssignToSection;
