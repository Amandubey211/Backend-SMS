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
  error, // added error prop for validations
}) => {
  return (
    <div className="mt-5">
      <div className={`p-2 ${error ? "border border-red-500 rounded" : ""}`}>
        <AssignToRadios
          assignTo={assignTo}
          handleChange={handleChange}
          isAssignToLabel={isAssignToLabel}
          title={assignTitle}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
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
