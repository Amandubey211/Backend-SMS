import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import StudentGradeModalFilterHeader from "./Component/StudentGradeModalFilterHeader";
import StudentModalGradeList from "./Component/StudentGradeModalList";
import StudentGradeSummary from "./Component/StudentGradeSummary";
import { FiLoader } from "react-icons/fi";
import { fetchStudentGrades } from "../../../../../../Store/Slices/Admin/Users/Students/student.action";
import { useParams } from "react-router-dom";
import ProtectedSection from "../../../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../../../config/permission";
const StudentGradeModal = ({ isOpen, onClose, student }) => {
  const { cid, sid } = useParams();
  const [filters, setFilters] = useState({
    arrangeBy: "",
    module: "",
    chapter: "",
    status: "",
    subject: "",
  });

  const handleFilterChange = (name, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
    const params = {};
    if (sid) params.subjectId = sid;
    if (name == "subject") params.subjectId = value;
    if (name == "module") params.moduleId = value;
    if (name == "chapter") params.chapterId = value;
    if (name == "arrangeBy") params.arrangeBy = value;
    getStudentGrades(params);
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
  const { grades, loading } = useSelector((store) => store.admin.all_students);
  const dispatch = useDispatch();
  const getStudentGrades = async (params) => {
    // const params = {};
    //      if (sid) params.subjectId = sid;
    //      if (filters.subject) params.subjectId   = filters.subject;
    //      if (filters.module) params.moduleId   = filters.module;
    //      if (filters.chapter) params.chapterId = filters.chapter;
    //      if (filters.arrangeBy) params.arrangeBy = filters.arrangeBy;
    dispatch(
      fetchStudentGrades({
        params,
        studentId: student?.studentId || student?._id,
        studentClassId: cid,
      })
    );
  };

  return (
    <>
      {loading ? (
        <>
          <div
            className={`fixed inset-0 flex items-end justify-center bg-black bg-opacity-50 z-40 transition-opacity duration-500 ease-in-out ${
              isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <div
              className={`bg-white w-full p-3 h-[97vh] rounded-t-lg shadow-lg transform transition-transform duration-500 ease-in-out ${
                isOpen ? "translate-y-0" : "translate-y-full"
              }`}
            >
              <div className="flex items-center h-[80%] w-[100%] justify-center flex-col gap-2">
                <FiLoader className="animate-spin mr-2 w-[3rem] h-[3rem] " />
                <p className="text-gray-800 text-lg">Loading...</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div
          className={`fixed inset-0 flex items-end justify-center bg-black bg-opacity-50 z-40 transition-opacity duration-500 ease-in-out ${
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
            <ProtectedSection
              requiredPermission={PERMISSIONS.GRADES_OF_ONE_STUDENT}
              title={"Student Grades"}
            >
              <div className="flex w-full">
                <div className="flex-1">
                  <StudentGradeModalFilterHeader
                    filters={filters}
                    onFilterChange={handleFilterChange}
                  />
                  <div className="h-96 overflow-y-scroll no-scrollbar">
                    <StudentModalGradeList
                      data={grades?.grades}
                      filters={filters}
                    />
                  </div>
                </div>
                <StudentGradeSummary
                  grades={grades}
                  studentData={grades.student}
                />
              </div>
            </ProtectedSection>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentGradeModal;
