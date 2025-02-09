import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Skeleton, Avatar } from "antd";
import StudentGradeModalFilterHeader from "./Component/StudentGradeModalFilterHeader";
import StudentModalGradeList from "./Component/StudentGradeModalList";
import StudentGradeSummary from "./Component/StudentGradeSummary";
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
    if (name === "subject") params.subjectId = value;
    if (name === "module") params.moduleId = value;
    if (name === "chapter") params.chapterId = value;
    if (name === "arrangeBy") params.arrangeBy = value;
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
            {/* Detailed Skeleton UI */}
            <div className="space-y-6">
              {/* Header Skeleton */}
              <div className="flex justify-between items-center border-b pb-2">
                <Skeleton.Input active style={{ width: "30%", height: 24 }} />
                <Skeleton.Button
                  active
                  style={{ width: 40, height: 40 }}
                  shape="circle"
                />
              </div>

              {/* Main Content Skeleton */}
              <div className="flex flex-col md:flex-row gap-4">
                {/* Left Section: Filter & List */}
                <div className="flex-1">
                  {/* Mimic Filter Header */}
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
                  {/* Mimic Table Header */}
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
                  {/* Mimic Table Rows */}
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

                {/* Right Section: Summary */}
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
