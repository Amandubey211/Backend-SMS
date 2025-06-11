import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation, Trans } from "react-i18next";
import StudentList from "./Components/StudentList";
import AssignmentDetails from "./Components/AssignmentDetails";
import SubmissionDetails from "./Components/SubmissionDetails";
import { MdOutlineAssignmentLate } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { useParams } from "react-router-dom";
import {
  fetchAssignedAssignmentStudents,
  fetchStudentAssignment,
} from "../../../../../Store/Slices/Admin/Class/SpeedGrade/AssignmentSpeedGradeThunks";
import {
  fetchAssignedQuizStudents,
  fetchStudentQuiz,
} from "../../../../../Store/Slices/Admin/Class/SpeedGrade/QuizSpeedGradeThunks";
import ShimmerLoader from "../../../../../Components/Common/ShimmerLoader";
import ProtectedSection from "../../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../../config/permission";

const MainSection = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [totalGrade, setTotalGrade] = useState(0);
  const { sgid, type } = useParams();
  const { t } = useTranslation("admModule");
  const dispatch = useDispatch();

  const { loading, error, assignmentDetails, quizDetails, students } =
    useSelector((state) => state.admin.speedgrades);
  console.log(assignmentDetails, quizDetails, "details");
  // Fetch students based on type
  useEffect(() => {
    if (type === "Assignment") {
      dispatch(fetchAssignedAssignmentStudents(sgid));
    } else {
      dispatch(fetchAssignedQuizStudents(sgid));
    }
  }, [dispatch, sgid, type]);

  // Automatically select the first student when students are loaded
  useEffect(() => {
    if (students && students.length > 0 && !selectedStudent) {
      handleStudentSelection(students[0]);
    } else if (students && students.length === 0) {
      setSelectedStudent(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [students]);

  const handleStudentSelection = (student) => {
    setSelectedStudent(student);
    if (student) {
      if (type === "Assignment") {
        dispatch(
          fetchStudentAssignment({ studentId: student._id, assignmentId: sgid })
        );
      } else if (type === "Quiz") {
        dispatch(fetchStudentQuiz({ studentId: student._id, quizId: sgid }));
      }
    }
  };

  const loadingStatus = loading;
  const details = type === "Assignment" ? assignmentDetails : quizDetails;

  const handleTotalGradeUpdate = (grade) => {
    setTotalGrade(grade);
  };
  console.log(selectedStudent, "dd");

  // Construct the full name using firstName and lastName if fullName is unavailable
  const getFullName = (student) => {
    return (
      student?.fullName ||
      `${student?.firstName || ""} ${student?.lastName || ""}`.trim()
    );
  };

  return (
    <ProtectedSection
      title="Speed Grades"
      requiredPermission={PERMISSIONS.ASSIGN_SPEED_GRADES}
    >
      <div className="flex h-screen">
        {/* Student List Section */}
        <div className="w-1/4 p-4 border-r border-gray-200 flex flex-col">
          {loading ? (
            <>
              {/* Shimmer Loaders for Student List */}
              {[...Array(5)].map((_, index) => (
                <ShimmerLoader
                  key={index}
                  width="100%"
                  height="40px"
                  className="mb-4"
                />
              ))}
            </>
          ) : students && students.length > 0 ? (
            <StudentList
              onSelectStudent={handleStudentSelection}
              students={students}
              selectedStudentId={selectedStudent?._id} // Pass selectedStudentId as prop
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-500 mt-10">
              <FaUserCircle className="text-6xl mb-4" />
              <p className="text-lg font-semibold">
                {t("No students present in this exam")}
              </p>
            </div>
          )}
        </div>

        {/* Middle Section */}
        <div className="w-1/2 p-2  flex flex-col">
          {students && students.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-gray-500 h-full">
              <MdOutlineAssignmentLate className="text-6xl mb-4 text-gray-400" />
              <p className="text-2xl font-semibold">
                {t("No students to display")}
              </p>
            </div>
          ) : !selectedStudent ? (
            <div className="flex flex-col items-center justify-center text-gray-400 h-full">
              <FaUserCircle className="text-9xl mb-4" />
              <p className="text-xl font-semibold">
                {t("Select a student to view details")}
              </p>
            </div>
          ) : loadingStatus ? (
            <div className="w-full p-4">
              {/* Shimmer Loaders for Assignment Details */}
              <ShimmerLoader width="80%" height="30px" className="mb-6" />
              <ShimmerLoader width="100%" height="200px" className="mb-4" />
              <ShimmerLoader width="60%" height="20px" />
            </div>
          ) : error || !details ? (
            <div className="flex-grow flex flex-col items-center justify-center text-gray-500">
              <MdOutlineAssignmentLate className="text-6xl mb-4 text-gray-400" />

              <div>
                No submission found for{" "}
                <span className="text-lg font-semibold capitalize">
                  {getFullName(selectedStudent)}
                </span>
              </div>
            </div>
          ) : (
            <AssignmentDetails
              student={selectedStudent}
              details={details}
              type={type}
              onTotalGradeUpdate={handleTotalGradeUpdate}
            />
          )}
        </div>

        {/* Right Section */}
        <div className="w-1/4 flex flex-col">
          <SubmissionDetails
            details={details}
            student={selectedStudent}
            initialGrade={totalGrade}
          />
        </div>
      </div>
    </ProtectedSection>
  );
};

export default MainSection;
