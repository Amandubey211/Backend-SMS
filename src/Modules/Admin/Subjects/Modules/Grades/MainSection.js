import React, { useState } from "react";
import SubjectSideBar from "../../Component/SubjectSideBar";
import GradeHeader from "./Component/GradeHeader";
import StudentTable from "./Component/StudentTable";
import studentsGrades from "./dummydata/dummystudents";

const MainSection = () => {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    section: "",
    group: "",
    assignment: "",
    quizzes: "",
  });

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

  return (
    <div className="flex ">
      <SubjectSideBar />
      <div className="border-l w-full ">
        <GradeHeader onSearch={handleSearchChange} onFilterChange={handleFilterChange} />
        <div className="h-screen overflow-y-scroll no-scrollbar">
          <StudentTable students={filteredStudents} />
        </div>
      </div>
    </div>
  );
};

export default MainSection;
