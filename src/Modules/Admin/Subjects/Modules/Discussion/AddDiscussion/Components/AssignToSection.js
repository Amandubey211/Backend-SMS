import React from "react";
import AssignToRadios from "../../../../Component/AssignToRadios";
import SectionSelect from "../../../../Component/SectionSelect";

const AssignToSection = ({ assignTo, section,groupId, handleChange , assignTitle }) => {
  return (
    <div className="mt-5">
      <AssignToRadios assignTo={assignTo} handleChange={handleChange}  title={assignTitle}/>
      <SectionSelect section={section} groupId={groupId} handleChange={handleChange} />
      
    </div>
  );
};

export default AssignToSection;
