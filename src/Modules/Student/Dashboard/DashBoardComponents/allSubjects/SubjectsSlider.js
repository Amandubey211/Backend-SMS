import React from "react";
import SubjectCard from "./SubjectCard";

const SubjectsSlider = ({ subjects }) => {
  return (
    <div
      className="overflow-y-auto py-2 flex flex-col gap-2"
      style={{ maxHeight: "700px" }}
    >
      {subjects?.map((subject, index) => (
        <div key={index} className="flex-none">
          <SubjectCard subject={subject} key={index} i={index} />
        </div>
      ))}
    </div>
  );
};

export default SubjectsSlider;
