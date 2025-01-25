import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SubjectSideBar from "../../Component/SubjectSideBar";
import GradeHeader from "./Component/GradeHeader";
import StudentTable from "./Component/StudentTable";
import StudentGradeModal from "./StudentGradeViewModal/StudentGradeModal";
import { FiLoader } from "react-icons/fi";
import { fetchSubjectGrades } from "../../../../../Store/Slices/Admin/Class/grades/grades.action";
import { useParams } from "react-router-dom";
import { fetchStudentGrades } from "../../../../../Store/Slices/Admin/Users/Students/student.action";
import { fetchFilteredAssignments } from "../../../../../Store/Slices/Admin/Class/Assignment/assignmentThunks";
import { fetchModules } from "../../../../../Store/Slices/Admin/Class/Module/moduleThunk";
import { fetchFilteredQuizzesThunk } from "../../../../../Store/Slices/Admin/Class/Quiz/quizThunks";
import ProtectedSection from "../../../../../Routes/ProtectedRoutes/ProtectedSection";
const MainSection = () => {
  const { cid, sid } = useParams();
  const [search, setSearch] = useState("");
  const [student, setStudent] = useState();
  const [filters, setFilters] = useState({
    moduleId: "",
    classId: cid,
    assignmentId: "",
    quizId: "",
    subjectId: sid,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { subjectGrades, loading } = useSelector(
    (store) => store.admin.subject_grades
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSubjectGrades({ classId: cid, subjectId: sid, filters }));
    dispatch(fetchModules({ cid, sid }));
    dispatch(fetchFilteredAssignments({ sid }));
    dispatch(fetchFilteredQuizzesThunk({ sid }));
  }, [dispatch]);

  const handleSearchChange = (value) => {
    setSearch(value);
  };

  const handleFilterChange = (name, value) => {
    const updatedFilters = {
      ...filters,
      [name]: value,
    };
    setFilters(updatedFilters);

    const params = {};
    if (updatedFilters.moduleId) params.moduleId = updatedFilters.moduleId;
    if (updatedFilters.quizId) params.quizId = updatedFilters.quizId;
    if (updatedFilters.assignmentId)
      params.assignmentId = updatedFilters.assignmentId;
    dispatch(
      fetchSubjectGrades({ classId: cid, subjectId: sid, filters: params })
    );
  };

  const handleRowClick = (student) => {
    const params = {};
    if (sid) params.subjectId = sid;
    dispatch(
      fetchStudentGrades({
        params,
        studentId: student?.studentId,
        studentClassId: cid,
      })
    );
    setStudent(student);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex w-full h-full ">
      <SubjectSideBar />
      <ProtectedSection
        title="Grades"
        requiredPermission="see grades"
        // aman={true}
      >
        <div className="border-l w-full mr-2">
          <GradeHeader
            onSearch={handleSearchChange}
            onFilterChange={handleFilterChange}
          />
          <div className="h-screen overflow-y-scroll no-scrollbar">
            {loading ? (
              <div className="flex items-center h-[80%] w-[100%] justify-center flex-col gap-2">
                <FiLoader className="animate-spin mr-2 w-[3rem] h-[3rem] " />
                <p className="text-gray-800 text-lg">Loading...</p>
              </div>
            ) : (
              <StudentTable
                students={subjectGrades?.filter((i) =>
                  i?.studentName?.toLowerCase()?.includes(search?.toLowerCase())
                )}
                onRowClick={handleRowClick}
              />
            )}
          </div>
        </div>
        {subjectGrades && (
          <StudentGradeModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            student={student}
          />
        )}
      </ProtectedSection>
    </div>
  );
};

export default MainSection;
