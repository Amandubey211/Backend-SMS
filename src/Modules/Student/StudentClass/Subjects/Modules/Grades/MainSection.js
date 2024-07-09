

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SubjectSideBar from "../../Component/SubjectSideBar";
import GradeHeader from "./Component/GradeHeader";
import StudentTable from "./Component/StudentTable";
// import studentGrades from "./dummydata/dummystudents";
import StudentGradeModal from "./StudentGradeViewModal/StudentGradeModal";
import { setStudentGrade } from "../../../../../../Redux/Slices/AdminSlice";
import StudentGradesAccordion from "./StudentGradeViewModal/Component/StudentGradesAccordion";
import { studentGrades } from "./dummydata/studentGradesAllSubject";
import GradeAccordionItem from "./StudentGradeViewModal/Component/GradeAccordionItem";
import StudentGradeSummary from "./StudentGradeViewModal/Component/StudentGradeSummary";

const MainSection = () => {
  const studentGrade = useSelector((store) => store.Admin.studentGrade);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    section: "",
    group: "",
    assignment: "",
    quizzes: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();

  const handleSearchChange = (value) => {
    setSearch(value);
  };

  const handleFilterChange = (name, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const fuzzySearch = (query, text) => {
    // query = query.toLowerCase();
    // text = text.toLowerCase();
    let queryIndex = 0;
    for (let i = 0; i < text.length; i++) {
      if (text[i] === query[queryIndex]) {
        queryIndex++;
      }
      if (queryIndex === query.length) {
        return true;
      }
    }
    return false;
  };

  const filteredStudents = [studentGrades].filter((student) => {
    return (
      fuzzySearch(search, student.name) &&
      (filters.section ? student.section === filters.section : true) &&
      (filters.group ? student.group === filters.group : true) &&
      (filters.assignment ? student.assignment === filters.assignment : true) &&
      (filters.quizzes ? student.quizzes === filters.quizzes : true)
    );
  });

  const handleRowClick = (student) => {
    dispatch(setStudentGrade(student));
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    dispatch(setStudentGrade({}));
  };
  const studentData = {
    avatar: studentGrades.avatar,
    name: studentGrades.name,
    section: studentGrades.section,
    assignment: studentGrades.assignment,
    groupAssignment: "TBD", 
    quiz: studentGrades.quizzes,
    groupQuiz: "TBD", 
    attendance: studentGrades.attendance,
    totalScore: studentGrades.score,
  };
  return (
  

    <>
     {/* <SubjectSideBar /> */}
      <div className="flex  w-full">
      <SubjectSideBar />
        <div key={studentGrades.id} className=" w-[70%]">
          {studentGrades.grades.map((grade, index) => (
            <GradeAccordionItem key={index} grade={grade} />
          ))}
        </div>
         <div className="w-[30%] h-full border-l border-gray-200  ">
         <StudentGradeSummary studentGrade={studentData}/>
         </div>
      </div>
    </>
  );
};

export default MainSection;