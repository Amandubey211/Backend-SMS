import React, { useState, useCallback } from "react";
import StudentList from "./Components/StudentList";
import AssignmentDetails from "./Components/AssignmentDetails";
import SubmissionDetails from "./Components/SubmissionDetails";
import Spinner from "../../../../../Components/Common/Spinner";
import NoDataFound from "../../../../../Components/Common/NoDataFound";
import { FaUserCircle } from "react-icons/fa";
import { useParams } from "react-router-dom";
import useGetStudentAssignment from "../../../../../Hooks/AuthHooks/Staff/Admin/SpeedGrade/Assignment/useGetStudentAssignment";
import useGetStudentQuiz from "../../../../../Hooks/AuthHooks/Staff/Admin/SpeedGrade/Quiz/useGetStudentQuiz";

const MainSection = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [totalGrade, setTotalGrade] = useState(0);
  const { sgid, type } = useParams();

  // Determine which hook to use based on the `type` parameter
  const {
    loading: assignmentLoading,
    error: assignmentError,
    assignmentDetails,
    fetchStudentAssignment,
  } = useGetStudentAssignment();

  const {
    loading: quizLoading,
    error: quizError,
    quizDetails,
    fetchStudentQuiz,
  } = useGetStudentQuiz();

  const handleStudentSelection = useCallback(
    (student) => {
      setSelectedStudent(student);
      if (student) {
        if (type === "Assignment") {
          fetchStudentAssignment(student._id, sgid);
        } else if (type === "Quiz") {
          fetchStudentQuiz(student._id, sgid);
        }
      }
    },
    [fetchStudentAssignment, fetchStudentQuiz, sgid, type]
  );

  const loading = type === "Assignment" ? assignmentLoading : quizLoading;
  const error = type === "Assignment" ? assignmentError : quizError;
  const details = type === "Assignment" ? assignmentDetails : quizDetails;

  const handleTotalGradeUpdate = (grade) => {
    setTotalGrade(grade);
  };

  return (
    <div className="flex h-screen">
      {/* Student List Section */}
      <div className="w-1/4 p-4 border-r border-gray-200 flex flex-col">
        <StudentList onSelectStudent={handleStudentSelection} />
      </div>

      {/* Middle Section */}
      {!selectedStudent ? (
        <div className="flex flex-col items-center justify-center text-gray-400 h-full w-full">
          <FaUserCircle className="text-9xl mb-4" /> {/* Large user icon */}
          <p className="text-xl font-semibold">
            Select a student to view details
          </p>
        </div>
      ) : (
        <>
          <div className="w-1/2 p-4 border-r border-gray-200 flex flex-col">
            {loading ? (
              <Spinner />
            ) : error ? (
              <NoDataFound />
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
            {details ? (
              <SubmissionDetails
                details={details}
                student={selectedStudent}
                initialGrade={totalGrade}
              />
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-gray-400">
                <FaUserCircle className="text-9xl mb-4" /> {/* Big icon */}
                <p className="text-lg font-semibold">No submission found</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MainSection;
