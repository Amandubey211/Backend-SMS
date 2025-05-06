// src/Modules/Admin/Verification/UnVerifiedStudentCard.js

import React from "react";
import { NavLink } from "react-router-dom";
import { CiUser } from "react-icons/ci";
import { useSelector } from "react-redux";
import ProtectedAction from "../../../Routes/ProtectedRoutes/ProtectedAction";
import { PERMISSIONS } from "../../../config/permission";

const UnVerifiedStudentCard = ({ studentId }) => {
  const { unVerifiedStudents, rejectedStudents } = useSelector(
    (state) => state.admin.verification
  );

  // Find the student in either array
  const student =
    unVerifiedStudents.find((student) => student._id === studentId) ||
    rejectedStudents.find((student) => student._id === studentId);

  if (!student) {
    return null; // or display a fallback UI
  }

  // Colors for student cards
  const colors = [
    "bg-yellow-300",
    "bg-blue-300",
    "bg-green-300",
    "bg-red-300",
    "bg-purple-300",
    "bg-pink-300",
  ];

  // Hash function to generate a unique number from the studentId
  const hashCode = (str) => {
    let hash = 0;
    if (str?.length === 0) return hash;
    for (let i = 0; i < str?.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  };

  // Calculate color index using the hash of studentId
  const colorIndex = hashCode(studentId) % colors?.length;
  const color = colors[colorIndex];

  return (
    <div className={`${color} p-6 rounded-lg shadow-md text-white relative`}>
      <ProtectedAction
        requiredPermission={PERMISSIONS.VERIFY_STUDENT}
        // aman={true}
      >
        <NavLink
          to={`/verify_students/${student._id}`}
          className="absolute top-4 right-4 bg-white text-gray-800 font-semibold py-1 px-3 rounded-full shadow-md hover:bg-gray-200 transition-colors"
        >
          View Student
        </NavLink>
      </ProtectedAction>

      <div className="mb-4">
        <h2 className="text-lg font-semibold">{student?.firstName}</h2>
        <p className="text-sm">{student.email}</p>
        <div className="flex items-center mt-2 text-sm">
          <p>Contact: {student.contactNumber}</p>
        </div>
      </div>
      <div className="flex items-center mt-4">
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white flex justify-center items-center bg-white text-gray-800">
          {student.profile ? (
            <img
              src={student.profile}
              alt="Student"
              className="w-full h-full object-cover"
            />
          ) : (
            <CiUser size={24} />
          )}
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium">QID: {student?.Q_Id || "N/A"}</p>
          {/* <p className="text-sm">SID: {student._id}</p> */}
        </div>
      </div>
    </div>
  );
};

export default React.memo(UnVerifiedStudentCard);
