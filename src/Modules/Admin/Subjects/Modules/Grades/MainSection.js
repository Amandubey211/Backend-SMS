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

  /* ───────── Local state ───────── */
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [student, setStudent] = useState(null);

  /* ───────── Filters (incl. semester) ───────── */
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

  /* Sync semesterId when the user picks / changes semester */
  useEffect(() => {
    if (selectedSemester) {
      setFilters((prev) => ({ ...prev, semesterId: selectedSemester.id }));
    }
  }, [selectedSemester]);

  /* Fetch grades + ancillary lists whenever filters change */
  useEffect(() => {
    if (!filters.semesterId) return; // nothing until we have a semester

    dispatch(fetchSubjectGrades({ classId: cid, subjectId: sid, filters }));
    dispatch(fetchModules({ cid, sid }));
    dispatch(fetchFilteredAssignments({ sid }));
    dispatch(fetchFilteredQuizzesThunk({ sid }));
  }, [dispatch, cid, sid, filters]);

  /* Search bar handler */
  const handleSearchChange = useCallback((val) => setSearch(val), []);

  /* Header filter handler */
  const handleFilterChange = useCallback(
    (name, value) => {
      setFilters((prev) => {
        const next = { ...prev, [name]: value };

        // build minimal params for re-fetch
        const params = {};
        if (next.moduleId) params.moduleId = next.moduleId;
        if (next.quizId) params.quizId = next.quizId;
        if (next.assignmentId) params.assignmentId = next.assignmentId;
        if (next.semesterId) params.semesterId = next.semesterId;

        dispatch(
          fetchSubjectGrades({ classId: cid, subjectId: sid, filters: params })
        );
        return next;
      });
    },
    [dispatch, cid, sid]
  );

  /* Row click → open modal (🔑 now passes semesterId too) */
  const handleRowClick = (clickedStudent) => {
    if (!clickedStudent) return;

    const params = { semesterId: filters.semesterId };
    if (sid) params.subjectId = sid;

    dispatch(
      fetchStudentGrades({
        params,
        studentId: clickedStudent.studentId,
        studentClassId: cid,
      })
    );

    setStudent(clickedStudent);
    setIsModalOpen(true);
  };

  /* Close modal */
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setStudent(null);
  };

  /* Simple client-side search */
  const filteredStudents = subjectGrades?.filter((s) =>
    s.studentName.toLowerCase().includes(search.toLowerCase())
  );

  /* ───────── Render ───────── */
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
            externalFilters={filters}
          />
        )}
      </ProtectedSection>
    </div>
  );
};

export default MainSection;
