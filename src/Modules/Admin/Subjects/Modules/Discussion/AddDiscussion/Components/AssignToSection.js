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
      {/* For Discussion, pass singular field names since backend expects "sectionId" and "groupId" */}
      <SectionSelect
        assignTo={assignTo}
        sectionValue={sectionId} // array of section IDs
        groupValue={groupId} // array of group IDs
        handleChange={handleChange}
        multiSelect={true}
        fieldSection="sectionId"
        fieldGroup="groupId"
      />
    </div>
  );
};

export default AssignToSection;
