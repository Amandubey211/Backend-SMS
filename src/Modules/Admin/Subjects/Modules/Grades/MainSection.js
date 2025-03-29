import React, { useState, useEffect, useCallback } from "react";
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
  const dispatch = useDispatch();
  const { selectedSemester } = useSelector(
    (state) => state.common.user.classInfo
  );

  // Search/filter states
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [student, setStudent] = useState(null);

  // Filter state including semesterId
  const [filters, setFilters] = useState({
    moduleId: "",
    classId: cid,
    assignmentId: "",
    quizId: "",
    subjectId: sid,
    semesterId: "",
  });

  const { subjectGrades, loading } = useSelector(
    (store) => store.admin.subject_grades
  );

  useEffect(() => {
    if (selectedSemester) {
      setFilters((prev) => ({
        ...prev,
        semesterId: selectedSemester.id,
      }));
    }
  }, [selectedSemester]);

  // Fetch data on mount or when filters change
  useEffect(() => {
    if (!filters.semesterId) return;
    dispatch(fetchSubjectGrades({ classId: cid, subjectId: sid, filters }));
    dispatch(fetchModules({ cid, sid }));
    dispatch(fetchFilteredAssignments({ sid }));
    dispatch(fetchFilteredQuizzesThunk({ sid }));
  }, [dispatch, cid, sid, filters]);
  console.log("Dispatching with filters:", filters);

  // Stabilize search change handler
  const handleSearchChange = useCallback((value) => {
    setSearch(value);
  }, []);

  // Use a functional update to avoid stale closures and remove filters from dependencies
  const handleFilterChange = useCallback(
    (name, value) => {
      setFilters((prevFilters) => {
        const updatedFilters = { ...prevFilters, [name]: value };

        // Build params with only valid filter values
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
        return updatedFilters;
      });
    },
    [dispatch, cid, sid]
  );

  // Handle student row click
  const handleRowClick = (clickedStudent) => {
    const params = {};
    if (sid) params.subjectId = sid;
    dispatch(
      fetchStudentGrades({
        params,
        studentId: clickedStudent?.studentId,
        studentClassId: cid,
      })
    );
    setStudent(clickedStudent);
    setIsModalOpen(true);
  };

  // Modal close handler
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setStudent(null);
  };

  // Filter students based on search text
  const filteredStudents = subjectGrades?.filter((i) =>
    i?.studentName?.toLowerCase().includes(search.toLowerCase())
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
