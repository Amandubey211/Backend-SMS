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
const StudentGradeModal = ({ isOpen, onClose, student }) => {
  const { cid, sid } = useParams();
  const dispatch = useDispatch();
  const { selectedSemester } = useSelector(
    (state) => state.common.user.classInfo
  );
  // Keep the selected student's ID in local state so we don't lose it on re-renders
  const [localStudentId, setLocalStudentId] = useState(null);

  // Default filter values
  const defaultFilters = {
    gradeMode: "online", // "online" or "offline"
    arrangeBy: "",
    module: "",
    chapter: "",
    status: "",
    subject: "",
    search: "",
    semester: "",
  };

  // Manage filters
  const [filters, setFilters] = useState(defaultFilters);

  // Track the first data load to show a full-screen skeleton
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Whenever we get a new `student` prop, store their ID
  useEffect(() => {
    if (student?.studentId) {
      setLocalStudentId(student.studentId);
    }
  }, [student]);

  useEffect(() => {
    if (selectedSemester?.id && !filters.semester && localStudentId) {
      const newFilters = { ...filters, semester: selectedSemester.id };
      setFilters(newFilters);

      // Trigger fetch with updated semester
      const params = {
        semesterId: selectedSemester.id,
        subjectId: sid,
        mode: newFilters.gradeMode,
      };

      debouncedGetStudentGrades(params);
    }
  }, [selectedSemester, filters.semester, sid, localStudentId]);

  /**
   * Fetch the student's grades from the backend,
   * but only if we have a valid localStudentId.
   */
  const getStudentGrades = async (params) => {
    if (!localStudentId) return; // skip if we don't have an ID
    try {
      await dispatch(
        fetchStudentGrades({
          params,
          studentId: localStudentId,
          studentClassId: cid,
        })
      );
    } catch (error) {
      console.error("Failed to fetch student grades:", error);
    }
  };

  /**
   * Debounce the fetch to avoid calling it too frequently
   * when users quickly toggle filters.
   */
  const debouncedGetStudentGrades = useMemo(
    () =>
      debounce((params) => {
        getStudentGrades(params);
      }, 300),
    [localStudentId] // must re-create if student changes
  );

  /**
   * Handle changes to filters. If user selects "offline" mode,
   * reset all online-only filters. Then build the new query params
   * and trigger the fetch (debounced).
   */
  const handleFilterChange = (name, value) => {
    let newFilters = { ...filters };

    if (name === "gradeMode") {
      newFilters.gradeMode = value;
      // Switching to offline: clear out online-specific filters
      if (value === "offline") {
        newFilters.arrangeBy = "";
        newFilters.module = "";
        newFilters.chapter = "";
        newFilters.status = "";
        newFilters.subject = "";
        newFilters.search = "";
      }
    } else if (name === "semester") {
      newFilters.semester = value.id ? value.id : value;
    } else {
      newFilters[name] = value;
    }
    setFilters(newFilters);

    // Construct query params for fetch
    const params = {};
    if (newFilters.semester) {
      params.semesterId = newFilters.semester;
    }
    if (name === "semester") {
      params.semesterId = value; // Pass the selected semester
    }
    // If the route param sid is available, use it (unless user changes subject)
    if (sid) params.subjectId = sid;
    // For example, if user changes subject in the filter
    if (name === "subject") {
      params.subjectId = value;
    }
    if (name === "module") {
      params.moduleId = value;
    }
    if (name === "chapter") {
      params.chapterId = value;
    }
    if (name === "arrangeBy") {
      params.arrangeBy = value;
    }

    // If we’re in "online" mode, we can filter by status
    if (newFilters.gradeMode === "online" && newFilters.status) {
      params.status = newFilters.status;
    }

    // If we’re in "offline" mode, we can add a "search" param
    if (newFilters.gradeMode === "offline" && newFilters.search) {
      params.search = newFilters.search;
    }

    // Always set the current mode
    params.mode = newFilters.gradeMode;

    // Trigger the debounced API call
    if (localStudentId) {
      debouncedGetStudentGrades(params);
    }
  };

  /**
   * Reset all filters to their default values and
   * fetch fresh data in "online" mode.
   */
  const handleResetFilters = useCallback(() => {
    const newFilters = {
      ...defaultFilters,
      semester: selectedSemester?.id || "", // 💡 set default semester
    };
    setFilters(newFilters);
    const params = {};
    if (sid) params.subjectId = sid;
    // default is "online"
    params.mode = "online";

    if (selectedSemester?.id) {
      params.semesterId = selectedSemester.id;
    }

    if (localStudentId) {
      getStudentGrades(params);
    }
  }, [sid, localStudentId, selectedSemester]);

  /**
   * Lock scroll on the background when the modal is open.
   */
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

  // Grab the grades data from Redux
  const { grades, loading } =
    useSelector((store) => store.admin.all_students) || {};
  //console.log(grades, "sdfsdf");

  // Mark the initial load done once we have fetched data at least once
  useEffect(() => {
    if (!loading && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [loading, isInitialLoad]);

  return (
    <>
      {isInitialLoad ? (
        /**
         * On the very first load, show a large skeleton screen
         * so we don't show a half-loaded UI
         */
        <div
          className={`fixed inset-0 flex items-end justify-center bg-black bg-opacity-50 z-40 transition-opacity duration-500 ease-in-out ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
        >
          <div
            className={`bg-white w-full p-3 h-[97vh] rounded-t-lg shadow-lg transform transition-transform duration-500 ease-in-out ${isOpen ? "translate-y-0" : "translate-y-full"
              }`}
          >
            <SkeletonLoadingUI />
          </div>
        </div>
      ) : (
        /**
         * After the first load, show the real UI
         */
        <div
          className={`fixed inset-0 flex items-end justify-center bg-black bg-opacity-50 z-40 transition-opacity duration-500 ease-in-out ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
        >
          <div
            className={`bg-white w-full p-3 h-[97vh] rounded-t-lg shadow-lg transform transition-transform duration-500 ease-in-out ${isOpen ? "translate-y-0" : "translate-y-full"
              }`}
          >
            {/* Header */}
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
                {/* Filter Column */}
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

                {/* Summary Column */}
                <StudentGradeSummary
                  grades={grades}
                  studentData={grades?.student}
                />
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
