import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import StudentList from "./Components/StudentList";
import AssignmentDetails from "./Components/AssignmentDetails";
import SubmissionDetails from "./Components/SubmissionDetails";
import Spinner from "../../../../../Components/Common/Spinner";
import NoDataFound from "../../../../../Components/Common/NoDataFound";
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

const MainSection = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [totalGrade, setTotalGrade] = useState(0);
  const { sgid, type } = useParams();
  const dispatch = useDispatch();

  const { loading, error, assignmentDetails, quizDetails, students } =
    useSelector((state) => state.admin.speedgrades);

  useEffect(() => {
    if (type === "Assignment") {
      dispatch(fetchAssignedAssignmentStudents(sgid));
    } else {
      dispatch(fetchAssignedQuizStudents(sgid));
    }
  }, [dispatch, sgid, type]);

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

  const loadingStatus = type === "Assignment" ? loading : loading;
  const errorStatus = type === "Assignment" ? error : error;
  const details = type === "Assignment" ? assignmentDetails : quizDetails;

  const handleTotalGradeUpdate = (grade) => {
    setTotalGrade(grade);
  };

  return (
    <div className="flex h-screen">
      {/* Student List Section */}
      <div className="w-1/4 p-4 border-r border-gray-200 flex flex-col">
        <StudentList
          onSelectStudent={handleStudentSelection}
          students={students}
        />
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
            {loadingStatus ? (
              <Spinner />
            ) : errorStatus ? (
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
