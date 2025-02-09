import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import SubjectSideBar from "../../Component/SubjectSideBar";
import GradeHeader from "./Component/GradeHeader";
import StudentTable from "./Component/StudentTable";
import StudentGradeModal from "./StudentGradeViewModal/StudentGradeModal";
import ProtectedSection from "../../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../../config/permission";
import { fetchSubjectGrades } from "../../../../../Store/Slices/Admin/Class/grades/grades.action";
import { fetchStudentGrades } from "../../../../../Store/Slices/Admin/Users/Students/student.action";
import { fetchFilteredAssignments } from "../../../../../Store/Slices/Admin/Class/Assignment/assignmentThunks";
import { fetchModules } from "../../../../../Store/Slices/Admin/Class/Module/moduleThunk";
import { fetchFilteredQuizzesThunk } from "../../../../../Store/Slices/Admin/Class/Quiz/quizThunks";

const MainSection = () => {
  const { cid, sid } = useParams();
  const [search, setSearch] = useState("");
  const [student, setStudent] = useState(null);
  const [filters, setFilters] = useState({
    moduleId: "",
    classId: cid,
    assignmentId: "",
    quizId: "",
    subjectId: sid,
    semesterId: "", // <-- New semester filter
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
  }, [dispatch, cid, sid, filters]);

  const handleSearchChange = (value) => {
    setSearch(value);
  };

  const handleFilterChange = (name, value) => {
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);

    // Only send filters with valid values
    const params = {};
    if (updatedFilters.moduleId) params.moduleId = updatedFilters.moduleId;
    if (updatedFilters.quizId) params.quizId = updatedFilters.quizId;
    if (updatedFilters.assignmentId)
      params.assignmentId = updatedFilters.assignmentId;
    if (updatedFilters.semesterId)
      params.semesterId = updatedFilters.semesterId;
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

  // Filter students based on search input
  const filteredStudents = subjectGrades?.filter((i) =>
    i?.studentName?.toLowerCase().includes(search?.toLowerCase())
  );

  return (
    <div className="flex w-full h-full">
      <SubjectSideBar />
      <ProtectedSection
        title="Grades"
        requiredPermission={PERMISSIONS.GRADES_OF_ONE_CLASS}
      >
        <div className="border-l w-full mr-2">
          <GradeHeader
            onSearch={handleSearchChange}
            onFilterChange={handleFilterChange}
          />
          <div className="h-screen overflow-y-scroll no-scrollbar">
            <StudentTable
              students={filteredStudents}
              loading={loading}
              onRowClick={handleRowClick}
            />
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
