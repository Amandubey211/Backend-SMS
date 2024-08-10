import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SubjectSideBar from "../../Component/SubjectSideBar";
import GradeHeader from "./Component/GradeHeader";
import StudentTable from "./Component/StudentTable";
import StudentGradeModal from "./StudentGradeViewModal/StudentGradeModal";
import { setStudentGrade } from "../../../../../Redux/Slices/AdminSlice";
import useFetchClassGrades from "../../../../../Hooks/AuthHooks/Staff/Admin/Grades/useFetchClassGrades";
import { LoaderIcon } from "react-hot-toast";
import { FiLoader } from "react-icons/fi";

const MainSection = () => {
  const studentGrade = useSelector((store) => store.Admin.studentGrade);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    moduleId: "",
    classId:"",
    assignmentId: "",
    quizId: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { error, fetchClassGrades, grades, loading } = useFetchClassGrades();

  useEffect(() => {
    fetchClassGrades();
  

  }, []);

  const handleSearchChange = (value) => {
       setSearch(value); 
   
  
  };

  const handleFilterChange = async(name, value) => {
// Update filters state
  const updatedFilters = {
    ...filters,
    [name]: value,
  };
  setFilters(updatedFilters);

  // Fetch grades with the updated filters
  await fetchClassGrades(updatedFilters);
  };

  const fuzzySearch = (query, text) => {
    query = query.toLowerCase();
    text = text.toLowerCase();
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

  const handleRowClick = (student) => {
    dispatch(setStudentGrade(student));
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    dispatch(setStudentGrade({}));
  };

  return (
    <div className="flex  ">
      <SubjectSideBar />
      <div className="border-l w-full mr-2">
        <GradeHeader onSearch={handleSearchChange} onFilterChange={handleFilterChange} />
        <div className="h-screen overflow-y-scroll no-scrollbar">
          {loading? <div className="flex items-center h-[80%] w-[100%] justify-center flex-col gap-2">
            <FiLoader className="animate-spin mr-2 w-[3rem] h-[3rem] " />
            <p className="text-gray-800 text-lg">Loading...</p>
            </div>:<StudentTable students={grades} onRowClick={handleRowClick} />}
        </div>
      </div>
      {studentGrade && <StudentGradeModal  isOpen={isModalOpen} onClose={handleCloseModal} />}
    </div>
  );
};

export default MainSection;
