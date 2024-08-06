import React, { useState } from "react";
import GradeAccordionItem from "./GradeAccordionItem";

const StudentGradesAccordion = ({ student }) => {
  const grades= [
    {
      subject: "Mathematics",
      evaluations: [
        {
          name: "Algebra Test",
          type: "Quiz",
          dueDate: "2024-04-10",
          submitDate: "2024-04-09",
          status: "Completed",
          score: "80%",
        },
      ],
    },
    {
      subject: "Science",
      evaluations: [
        {
          name: "Chemistry Assignment",
          type: "Assignment",
          dueDate: "2024-05-01",
          submitDate: "2024-04-30",
          status: "Completed",
          score: "75%",
        },
      ],
    },
  ]
  return (
    <>
      <div> 
        <div key={student.id} className="">
        {grades?.map((grade, index) => (
            <GradeAccordionItem key={index} grade={grade} />
          ))} 
        </div>
      </div>
    </>
  );
};

export default StudentGradesAccordion;
