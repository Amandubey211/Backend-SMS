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

const StudentGradeModal = ({ isOpen, onClose, student }) => {
  const { cid, sid } = useParams();
  const dispatch = useDispatch();

  // Default filters: online mode is the default.
  const defaultFilters = {
    gradeMode: "online", // "online" or "offline"
    arrangeBy: "",
    module: "",
    chapter: "",
    status: "",
    subject: "",
  };

  const [filters, setFilters] = useState(defaultFilters);

  // Track if this is the very first load.
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Function to fetch student grades.
  const getStudentGrades = async (params) => {
    try {
      dispatch(
        fetchStudentGrades({
          params,
          studentId: student?.studentId || student?._id,
          studentClassId: cid,
        })
      );
    } catch (error) {
      console.error("Failed to fetch student grades:", error);
    }
  };

  // Create a debounced version of getStudentGrades.
  const debouncedGetStudentGrades = useMemo(
    () =>
      debounce((params) => {
        getStudentGrades(params);
      }, 300),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Handle filter changes (including gradeMode).
  const handleFilterChange = (name, value) => {
    try {
      let newFilters = { ...filters };
      if (name === "gradeMode") {
        newFilters = { ...newFilters, gradeMode: value };
        // When offline is selected, clear online-specific filters.
        if (value === "offline") {
          newFilters = {
            ...newFilters,
            arrangeBy: "",
            module: "",
            chapter: "",
            status: "",
            subject: "",
          };
        }
      } else {
        newFilters = { ...newFilters, [name]: value };
      }
      setFilters(newFilters);

      // Build query parameters.
      const params = {};
      if (sid) params.subjectId = sid;
      if (name === "subject") params.subjectId = value;
      if (name === "module") params.moduleId = value;
      if (name === "chapter") params.chapterId = value;
      if (name === "arrangeBy") params.arrangeBy = value;
      // IMPORTANT: For offline mode, do not include the status filter in the query.
      if (name === "status" && newFilters.gradeMode !== "offline") {
        params.status = value;
      }
      // Set type based on grade mode.
      params.type =
        newFilters.gradeMode === "offline" ? "offline_exam" : "online";

      debouncedGetStudentGrades(params);
    } catch (error) {
      console.error("Error handling filter change:", error);
    }
  };

  // Reset filters to default.
  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
    const params = {};
    if (sid) params.subjectId = sid;
    params.type = "online"; // default mode is online
    debouncedGetStudentGrades(params);
  }, [sid, debouncedGetStudentGrades, defaultFilters]);

  // Manage body scroll.
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

  // Retrieve grade data from Redux store.
  const { grades, loading } =
    useSelector((store) => store.admin.all_students) || {};

  // Mark initial load complete once data is loaded.
  useEffect(() => {
    if (!loading && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [loading, isInitialLoad]);

  return (
    <>
      {isInitialLoad ? (
        // Full-screen skeleton UI on initial load.
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
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-2">
                <Skeleton.Input active style={{ width: "30%", height: 24 }} />
                <Skeleton.Button
                  active
                  style={{ width: 40, height: 40 }}
                  shape="circle"
                />
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <Skeleton.Input
                      active
                      style={{ width: "100%", height: 32 }}
                    />
                    <Skeleton.Input
                      active
                      style={{ width: "100%", height: 32 }}
                    />
                    <Skeleton.Input
                      active
                      style={{ width: "100%", height: 32 }}
                    />
                    <Skeleton.Input
                      active
                      style={{ width: "100%", height: 32 }}
                    />
                  </div>
                  <div className="flex justify-between items-center bg-gray-100 px-4 py-2">
                    {Array.from({ length: 6 }).map((_, idx) => (
                      <Skeleton.Input
                        key={idx}
                        active
                        style={{
                          width: "15%",
                          height: 16,
                          marginRight: idx < 5 ? 8 : 0,
                        }}
                      />
                    ))}
                  </div>
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center border-b px-4 py-2"
                      >
                        {Array.from({ length: 6 }).map((_, idx) => (
                          <Skeleton.Input
                            key={idx}
                            active
                            style={{
                              width: "15%",
                              height: 16,
                              marginRight: idx < 5 ? 8 : 0,
                            }}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-full md:w-1/4 border-l pl-4">
                  <div className="flex flex-col items-center border-b pb-4">
                    <Avatar size={96} style={{ backgroundColor: "#f0f0f0" }} />
                    <div className="mt-4">
                      <Skeleton.Input
                        active
                        style={{ width: 120, height: 24 }}
                      />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Skeleton.Input
                        key={idx}
                        active
                        style={{ width: "100%", height: 20 }}
                      />
                    ))}
                    <div className="flex justify-between items-center border-t pt-2">
                      <Skeleton.Input
                        active
                        style={{ width: "40%", height: 24 }}
                      />
                      <Skeleton.Input
                        active
                        style={{ width: "30%", height: 24 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Normal UI after initial load.
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
                      data={grades?.grades || []}
                      filters={filters}
                      tableLoading={loading}
                      onResetFilters={handleResetFilters}
                    />
                  </div>
                </div>
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

export default StudentGradeModal;
