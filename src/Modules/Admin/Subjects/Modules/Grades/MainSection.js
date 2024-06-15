import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SubjectSideBar from "../../Component/SubjectSideBar";
import GradeHeader from "./Component/GradeHeader";
import StudentTable from "./Component/StudentTable";
import studentsGrades from "./dummydata/dummystudents";
import StudentGradeModal from "./StudentGradeViewModal/StudentGradeModal";
import { setStudentGrade } from "../../../../../Redux/Slices/AdminSlice";

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

  const filteredStudents = studentsGrades.filter((student) => {
    return (
      student.name.toLowerCase().includes(search.toLowerCase()) &&
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
    dispatch(setStudentGrade(null));
  };

  return (
    <div className="flex">
      <SubjectSideBar />
      <div className="border-l w-full">
        <GradeHeader
          onSearch={handleSearchChange}
          onFilterChange={handleFilterChange}
        />
        <div className="h-screen overflow-y-scroll no-scrollbar">
          <StudentTable
            students={filteredStudents}
            onRowClick={handleRowClick}
          />
        </div>
      </div>
      {studentGrade && (
        <StudentGradeModal isOpen={isModalOpen} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default MainSection;
