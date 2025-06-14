import React from "react";
import AssignToRadios from "../../../../Component/AssignToRadios";
import SectionSelect from "../../../../Component/SectionSelect";

const AssignToSection = ({
  assignTo,
  sectionId,
  groupId,
  handleChange,
  assignTitle,
  formErrors = {},
}) => {
  return (
    <div className="mt-5">
      <AssignToRadios
        assignTo={assignTo}
        handleChange={handleChange}
        isAssignToLabel={false}
      />
      <SectionSelect
        assignTo={assignTo}
        sectionValue={sectionId}
        groupValue={groupId}
        handleChange={handleChange}
        multiSelect={true}
        fieldSection="sectionId"
        fieldGroup="groupId"
        formErrors={formErrors}
      />
    </div>
  );
};

export default AssignToSection;
