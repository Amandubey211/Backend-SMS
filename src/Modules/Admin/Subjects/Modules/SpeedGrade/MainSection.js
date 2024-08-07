import React, { useState, useCallback } from "react";
import StudentList from "./Components/StudentList";
import AssignmentDetails from "./Components/AssignmentDetails";
import SubmissionDetails from "./Components/SubmissionDetails";
import Spinner from "../../../../../Components/Common/Spinner";
import NoDataFound from "../../../../../Components/Common/NoDataFound";
import { FaUserCircle } from "react-icons/fa"; // Importing an icon from react-icons
import useGetStudentAssignment from "../../../../../Hooks/AuthHooks/Staff/Admin/SpeedGrade/useGetStudentAssignment";
import { useParams } from "react-router-dom";

const MainSection = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const { loading, error, assignmentDetails, fetchStudentAssignment } =
    useGetStudentAssignment();
  const { sgid } = useParams();

  const handleStudentSelection = useCallback(
    (student) => {
      setSelectedStudent(student);
      if (student) {
        fetchStudentAssignment(student._id, sgid);
      }
    },
    [fetchStudentAssignment, sgid]
  );

  return (
    <div className="flex">
      {/* Student List Section */}
      <div className="w-1/4 p-4 border-r border-gray-200">
        <StudentList onSelectStudent={handleStudentSelection} />
      </div>

      {/* Placeholder when no student is selected */}
      {!selectedStudent ? (
        <div className="flex-grow flex flex-col items-center justify-center text-gray-400">
          <FaUserCircle className="text-9xl mb-4" /> {/* Big icon */}
          <p className="text-lg font-semibold">No student selected</p>
          <p>Please select a student to view details.</p>
        </div>
      ) : (
        <>
          {/* Middle Section */}
          <div className="w-1/2 p-4 border-r border-gray-200">
            {loading ? (
              <Spinner />
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : (
              <AssignmentDetails
                student={selectedStudent}
                assignment={assignmentDetails}
              />
            )}
          </div>

          {/* Right Section */}
          <div className="w-1/4 p-2">
            <SubmissionDetails assignmentId={sgid} />
          </div>
        </>
      )}
    </div>
  );
};

export default MainSection;
