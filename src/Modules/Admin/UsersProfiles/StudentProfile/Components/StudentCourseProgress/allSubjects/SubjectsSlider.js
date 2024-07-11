import React from "react";
import SubjectCard from "./SubjectCard";

const SubjectsSlider = ({ subjects }) => {
  return (
    <div className="overflow-x-auto whitespace-nowrap py-2 flex  gap-2">
      {subjects.map((subject, index) => (
        <>
          <div className="">
            <SubjectCard key={index} subject={subject} />
          </div>
        </>
      ))}
    </div>
  );
};

export default SubjectsSlider;
