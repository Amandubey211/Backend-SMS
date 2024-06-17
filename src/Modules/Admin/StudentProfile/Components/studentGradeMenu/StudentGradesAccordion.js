import React, { useState } from "react";
import GradeAccordionItem from "./GradeAccordionItem";

const StudentGradesAccordion = ({ student }) => {
  return (
    <>
      <div>
        <div key={student.id} className="">
          {student.grades.map((grade, index) => (
            <GradeAccordionItem key={index} grade={grade} />
          ))}
        </div>
      </div>
    </>
  );
};

export default StudentGradesAccordion;
