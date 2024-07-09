
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import StudentGradeModalFilterHeader from "./Component/StudentGradeModalFilterHeader";
import StudentModalGradeList from "./Component/StudentGradeModalList";
import StudentGradeSummary from "./Component/StudentGradeSummary";


const dummyData = [
  { name: "Final Test Exam", type: "Group Assignment", module: "Module 1", chapter: "Chapter 1", dueDate: "01 / 10 / 2024", submittedDate: "20 / 10 / 2024", status: "Submit", score: "80 / 100", assignment: "Assignment 1", groupAssignment: "Group 1", quiz: "Quiz 1", groupQuiz: "Group Quiz 1" },
  { name: "Final Test Exam", type: "Quiz", module: "Module 1", chapter: "Chapter 2", dueDate: "01 / 10 / 2024", submittedDate: "20 / 10 / 2024", status: "Submit", score: "80 / 100", assignment: "Assignment 2", groupAssignment: "Group 2", quiz: "Quiz 2", groupQuiz: "Group Quiz 2" },
  { name: "Final Test Exam", type: "Assignment", module: "Module 1", chapter: "Chapter 3", dueDate: "01 / 10 / 2024", submittedDate: "20 / 10 / 2024", status: "Excused", score: "80 / 100", assignment: "Assignment 3", groupAssignment: "Group 3", quiz: "Quiz 3", groupQuiz: "Group Quiz 3" },
  { name: "Final Test Exam", type: "Assignment", module: "Module 1", chapter: "Chapter 2", dueDate: "01 / 10 / 2024", submittedDate: "20 / 10 / 2024", status: "Missing", score: "80 / 100", assignment: "Assignment 4", groupAssignment: "Group 4", quiz: "Quiz 4", groupQuiz: "Group Quiz 4" },
  { name: "Mid Term Exam", type: "Group Assignment", module: "Module 2", chapter: "Chapter 3", dueDate: "05 / 10 / 2024", submittedDate: "22 / 10 / 2024", status: "Submit", score: "85 / 100", assignment: "Assignment 5", groupAssignment: "Group 5", quiz: "Quiz 5", groupQuiz: "Group Quiz 5" },
  { name: "Mid Term Exam", type: "Group Quiz", module: "Module 2", chapter: "Chapter 1", dueDate: "05 / 10 / 2024", submittedDate: "22 / 10 / 2024", status: "Excused", score: "85 / 100", assignment: "Assignment 6", groupAssignment: "Group 6", quiz: "Quiz 6", groupQuiz: "Group Quiz 6" },
  { name: "Mid Term Exam", type: "Assignment", module: "Module 2", chapter: "Chapter 2", dueDate: "05 / 10 / 2024", submittedDate: "22 / 10 / 2024", status: "Missing", score: "85 / 100", assignment: "Assignment 7", groupAssignment: "Group 7", quiz: "Quiz 7", groupQuiz: "Group Quiz 7" },
  { name: "Mid Term Exam", type: "Group Assignment", module: "Module 2", chapter: "Chapter 1", dueDate: "05 / 10 / 2024", submittedDate: "22 / 10 / 2024", status: "Submit", score: "85 / 100", assignment: "Assignment 8", groupAssignment: "Group 8", quiz: "Quiz 8", groupQuiz: "Group Quiz 8" },
  { name: "Preliminary Test", type: "Quiz", module: "Module 3", chapter: "Chapter 1", dueDate: "15 / 10 / 2024", submittedDate: "30 / 10 / 2024", status: "Submit", score: "90 / 100", assignment: "Assignment 9", groupAssignment: "Group 9", quiz: "Quiz 9", groupQuiz: "Group Quiz 9" },
  { name: "Preliminary Test", type: "Assignment", module: "Module 3", chapter: "Chapter 2", dueDate: "15 / 10 / 2024", submittedDate: "30 / 10 / 2024", status: "Excused", score: "90 / 100", assignment: "Assignment 10", groupAssignment: "Group 10", quiz: "Quiz 10", groupQuiz: "Group Quiz 10" },
  { name: "Preliminary Test", type: "Group Assignment", module: "Module 3", chapter: "Chapter 3", dueDate: "15 / 10 / 2024", submittedDate: "30 / 10 / 2024", status: "Missing", score: "90 / 100", assignment: "Assignment 11", groupAssignment: "Group 11", quiz: "Quiz 11", groupQuiz: "Group Quiz 11" },
  { name: "Final Project", type: "Assignment", module: "Module 4", chapter: "Chapter 1", dueDate: "25 / 10 / 2024", submittedDate: "05 / 11 / 2024", status: "Submit", score: "95 / 100", assignment: "Assignment 12", groupAssignment: "Group 12", quiz: "Quiz 12", groupQuiz: "Group Quiz 12" },
  { name: "Final Project", type: "Quiz", module: "Module 4", chapter: "Chapter 2", dueDate: "25 / 10 / 2024", submittedDate: "05 / 11 / 2024", status: "Excused", score: "95 / 100", assignment: "Assignment 13", groupAssignment: "Group 13", quiz: "Quiz 13", groupQuiz: "Group Quiz 13" },
  { name: "Final Project", type: "Group Assignment", module: "Module 4", chapter: "Chapter 3", dueDate: "25 / 10 / 2024", submittedDate: "05 / 11 / 2024", status: "Missing", score: "95 / 100", assignment: "Assignment 14", groupAssignment: "Group 14", quiz: "Quiz 14", groupQuiz: "Group Quiz 14" }
];

const StudentGradeModal = ({ isOpen, onClose }) => {
  const [filters, setFilters] = useState({
    arrangeBy: "",
    module: "",
    chapter: "",
    status: ""
  });

  const handleFilterChange = (name, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value
    }));
  };

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  const studentGrade = useSelector((store) => store.Admin.studentGrade);
  // console.log(studentGrade._id)

  return (
    <div
      className={`fixed inset-0 flex items-end justify-center bg-black bg-opacity-50 z-20 transition-opacity duration-500 ease-in-out ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`bg-white w-full p-3 h-[97vh] rounded-t-lg shadow-lg transform transition-transform duration-500 ease-in-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex justify-between items-center p-1 border-b">
          <h2 className="text-lg font-semibold">Total Grade</h2>
          <button
            onClick={onClose}
            className="text-gray-600 text-3xl hover:text-gray-900"
          >
            &times;
          </button>
        </div>
        <div className="flex w-full">
          <div className="flex-1">
            <StudentGradeModalFilterHeader filters={filters} onFilterChange={handleFilterChange} />
            <div className="h-96 overflow-y-scroll no-scrollbar">
              <StudentModalGradeList data={dummyData} filters={filters} />
            </div>
          </div>
          <StudentGradeSummary studentGrade={studentGrade} />
        </div>
      </div>
    </div>
  );
};

export default StudentGradeModal;

