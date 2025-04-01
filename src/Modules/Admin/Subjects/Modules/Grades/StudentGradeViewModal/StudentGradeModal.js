import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Skeleton, Avatar } from "antd";
import { useParams } from "react-router-dom";
import { debounce } from "lodash";

import ProtectedSection from "../../../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../../../config/permission";
import { fetchStudentGrades } from "../../../../../../Store/Slices/Admin/Users/Students/student.action";

import StudentGradeModalFilterHeader from "./Component/StudentGradeModalFilterHeader";
import StudentModalGradeList from "./Component/StudentGradeModalList";
import StudentGradeSummary from "./Component/StudentGradeSummary";

/**
 * StudentGradeModal
 *
 * This modal displays the detailed grades for a single student.
 * - `isOpen` controls the visibility of the modal.
 * - `onClose` is a callback to close the modal.
 * - `student` is the object of the currently selected student,
 *   expected to have at least `studentId`.
 */
const StudentGradeModal = ({ isOpen, onClose, student, externalFilters = null }) => {
  const { cid, sid: sidFromParams } = useParams();
  const dispatch = useDispatch();

  const { selectedSemester, semesters } = useSelector((state) => ({
    selectedSemester: state.common.user.classInfo.selectedSemester,
    semesters: state.admin.semesters || [],
  }));

  const effectiveSemester = selectedSemester || semesters?.[0] || null;
  const studentId = student?._id || student?.studentId; 
  const subjectId = externalFilters?.subjectId ?? sidFromParams ?? "";
  const semesterId = externalFilters?.semesterId || effectiveSemester?.id || "";

  const defaultFilters = {
    gradeMode: "online",
    arrangeBy: "",
    module: externalFilters?.moduleId || "",
    chapter: "",
    status: "",
    subject: subjectId,
    search: "",
    semester: semesterId,
  };

  const [filters, setFilters] = useState(defaultFilters);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [hasFetchedInitialGrades, setHasFetchedInitialGrades] = useState(false);

  useEffect(() => {
    if (!studentId || !semesterId || !isOpen || hasFetchedInitialGrades) return;

    setHasFetchedInitialGrades(true);

    setFilters((prev) => ({
      ...prev,
      semester: semesterId,
      subject: subjectId,
    }));

    const params = {
      mode: "online",
      semesterId,
      subjectId,
      ...(externalFilters || {}),
    };

    getStudentGrades(params);
  }, [studentId, semesterId, subjectId, isOpen, hasFetchedInitialGrades, externalFilters]);

  const getStudentGrades = async (params) => {
    if (!studentId) return;
    try {
      await dispatch(
        fetchStudentGrades({
          params,
          studentId,
          studentClassId: cid,
        })
      );
    } catch (error) {
      console.error("Failed to fetch student grades:", error);
    }
  };

  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters };

    if (name === "gradeMode") {
      newFilters.gradeMode = value;
      if (value === "offline") {
        newFilters.arrangeBy = "";
        newFilters.module = "";
        newFilters.chapter = "";
        newFilters.status = "";
        newFilters.subject = "";
        newFilters.search = "";
      }
    } else if (name === "semester") {
      newFilters.semester = value?.id || value;
    } else {
      newFilters[name] = value;
    }

    setFilters(newFilters);

    const params = {
      semesterId: newFilters.semester,
      mode: newFilters.gradeMode,
    };

    if (newFilters.subject && newFilters.subject !== "") {
      params.subjectId = newFilters.subject;
    }

    if (externalFilters?.moduleId || newFilters.module) {
      params.moduleId = newFilters.module || externalFilters?.moduleId;
    }
    if (externalFilters?.assignmentId || newFilters.assignmentId) {
      params.assignmentId = newFilters.assignmentId || externalFilters?.assignmentId;
    }
    if (externalFilters?.quizId || newFilters.quizId) {
      params.quizId = newFilters.quizId || externalFilters?.quizId;
    }

    if (name === "subject") params.subjectId = value;
    if (name === "module") params.moduleId = value;
    if (name === "chapter") params.chapterId = value;
    if (name === "arrangeBy") params.arrangeBy = value;
    if (newFilters.gradeMode === "online" && newFilters.status) {
      params.status = newFilters.status;
    }
    if (newFilters.gradeMode === "offline" && newFilters.search) {
      params.search = newFilters.search;
    }

    if (studentId) {
      getStudentGrades(params);
    }
  };

  const handleResetFilters = useCallback(() => {
    const resetFilters = {
      ...defaultFilters,
      semester: semesterId,
      subject: subjectId,
    };

    setFilters(resetFilters);

    const params = {
      semesterId,
      subjectId,
      mode: "online",
      ...(externalFilters || {}),
    };

    if (studentId) {
      getStudentGrades(params);
    }
  }, [studentId, semesterId, subjectId, externalFilters]);

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

  const { grades, loading } = useSelector((store) => store.admin.all_students) || {};

  useEffect(() => {
    if (!loading && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [loading, isInitialLoad]);

  return (
    <>
      {isInitialLoad ? (
        <div className={`fixed inset-0 flex items-end justify-center bg-black bg-opacity-50 z-40 transition-opacity duration-500 ease-in-out ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}>
          <div className={`bg-white w-full p-3 h-[97vh] rounded-t-lg shadow-lg transform transition-transform duration-500 ease-in-out ${isOpen ? "translate-y-0" : "translate-y-full"
            }`}>
            <SkeletonLoadingUI />
          </div>
        </div>
      ) : (
        <div className={`fixed inset-0 flex items-end justify-center bg-black bg-opacity-50 z-40 transition-opacity duration-500 ease-in-out ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}>
          <div className={`bg-white w-full p-3 h-[97vh] rounded-t-lg shadow-lg transform transition-transform duration-500 ease-in-out ${isOpen ? "translate-y-0" : "translate-y-full"
            }`}>
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
                    onResetFilters={handleResetFilters}
                  />
                  <div className="h-96 overflow-y-scroll no-scrollbar">
                    <StudentModalGradeList
                      data={grades?.grades || []}
                      filters={filters}
                      tableLoading={loading}
                      onResetFilters={handleResetFilters}
                    />
                  </div>
                </div>
                <StudentGradeSummary grades={grades} studentData={grades?.student} />
              </div>
            </ProtectedSection>
          </div>
        </div>
      )}
    </>
  );
};

/**
 * A simple skeleton placeholder UI used during the initial load.
 */
const SkeletonLoadingUI = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-2">
        <Skeleton.Input active style={{ width: "30%", height: 24 }} />
        <Skeleton.Button
          active
          style={{ width: 40, height: 40 }}
          shape="circle"
        />
      </div>
      <div className="flex flex-col md:flex-row gap-4 mt-4">
        <div className="flex-1">
          <Skeleton paragraph={{ rows: 8 }} active />
        </div>
        <div className="w-full md:w-1/4 border-l pl-4">
          <Skeleton.Avatar active size={96} shape="circle" />
          <Skeleton paragraph={{ rows: 6 }} active className="mt-4" />
        </div>
      </div>
    </div>
  );
};

export default StudentGradeModal;
