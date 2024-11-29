import React from "react";
import GradeAccordionItem from "./GradeAccordionItem";

const StudentGradesAccordion = ({ student }) => {
  if (!student.grades || !Array.isArray(student.grades)) return null;

  return (
    <div>
      {student.grades?.map((grade, index) => (
        <GradeAccordionItem key={index} grade={grade} />
      ))}
    </div>
  );
};

export default StudentGradesAccordion;
