import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import StudentGradeModalFilterHeader from "./Component/StudentGradeModalFilterHeader";
import StudentModalGradeList from "./Component/StudentGradeModalList";
import StudentGradeSummary from "./Component/StudentGradeSummary";
import useFetchStudentGrades from "../../../../../../Hooks/AuthHooks/Staff/Admin/Grades/useFetchStudentGrades";
import dummyData from "./Component/DummyData";
import { FiLoader } from "react-icons/fi";

const StudentGradeModal = ({ isOpen, onClose }) => {
  const [filters, setFilters] = useState({
    arrangeBy: "",
    module: "",
    chapter: "",
    status: "",
  });

  const handleFilterChange = (name, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
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
  const { error, fetchStudentGrades, grades, loading, totals } = useFetchStudentGrades();
  useEffect(() => {
    console.log('--',studentGrade);
    
    if(isOpen){
      fetchStudentGrades(studentGrade.studentId||studentGrade._id, filters.module, filters.chapter, filters.arrangeBy);
    }
   
  }, [studentGrade, fetchStudentGrades, filters]);

  return (
    <>
      {loading ? <>
        <div
          className={`fixed inset-0 flex items-end justify-center bg-black bg-opacity-50 z-40 transition-opacity duration-500 ease-in-out ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
        >
          <div
            className={`bg-white w-full p-3 h-[97vh] rounded-t-lg shadow-lg transform transition-transform duration-500 ease-in-out ${isOpen ? "translate-y-0" : "translate-y-full"
              }`}
          >
            <div className="flex items-center h-[80%] w-[100%] justify-center flex-col gap-2">
            <FiLoader className="animate-spin mr-2 w-[3rem] h-[3rem] " />
            <p className="text-gray-800 text-lg">Loading...</p>
            </div>
          </div>
        </div>
      </> :
        <><div
          className={`fixed inset-0 flex items-end justify-center bg-black bg-opacity-50 z-40 transition-opacity duration-500 ease-in-out ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
        >
          <div
            className={`bg-white w-full p-3 h-[97vh] rounded-t-lg shadow-lg transform transition-transform duration-500 ease-in-out ${isOpen ? "translate-y-0" : "translate-y-full"
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
                <StudentGradeModalFilterHeader
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />
                <div className="h-96 overflow-y-scroll no-scrollbar">
                  <StudentModalGradeList data={grades.grades} filters={filters} />
                </div>
              </div>
              <StudentGradeSummary studentGrade={grades} />
              
            </div>
          </div>
        </div></>}
    </>

  );
};

export default StudentGradeModal;
