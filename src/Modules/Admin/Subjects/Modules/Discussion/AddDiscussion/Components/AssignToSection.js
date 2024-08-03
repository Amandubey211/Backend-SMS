import React from "react";
import AssignToRadios from "../../../../Component/AssignToRadios";
import SectionSelect from "../../../../Component/SectionSelect";

const AssignToSection = ({
  assignTo,
  sectionId,
  groupId,
  handleChange,
  assignTitle,
}) => {
  return (
    <div className="mt-5">
      <AssignToRadios
        assignTo={assignTo}
        handleChange={handleChange}
        isAssignToLabel={false}
        title={assignTitle}
      />
      <SectionSelect
        assignTo={assignTo}
        section={sectionId}
        groupId={groupId}
        handleChange={handleChange}
      />
    </div>
  );
};

export default AssignToSection;
