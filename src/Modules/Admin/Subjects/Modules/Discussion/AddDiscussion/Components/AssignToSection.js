import React from "react";
import AssignToRadios from "../../../../Component/AssignToRadios";
import SectionSelect from "../../../../Component/SectionSelect";

const AssignToSection = ({ assignTo, section, handleChange }) => {
  return (
    <div className="mt-5">
      <AssignToRadios assignTo={assignTo} handleChange={handleChange} />
      <SectionSelect section={section} handleChange={handleChange} />
    </div>
  );
};

export default AssignToSection;
