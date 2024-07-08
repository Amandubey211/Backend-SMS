import React from "react";
import { NavLink } from "react-router-dom";

const UnVerifiedStudentCard = ({ student, color }) => {
  return (
    <div className={`${color} p-6 rounded-lg shadow-md text-white relative`}>
      <NavLink
        to={`/verify_students/${student._id}`}
        className="absolute top-4 right-4 bg-white text-gray-800 font-semibold py-1 px-3 rounded-full shadow-md hover:bg-gray-200 transition-colors"
      >
        Verify Student
      </NavLink>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">{student?.firstName}</h2>
        <p className="text-sm">{student.email}</p>
        <div className="flex items-center mt-2 text-sm">
          <p>Contact: {student.contactNumber}</p>
        </div>
      </div>
      <div className="flex items-center mt-4">
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
          <img
            src="https://avatars.githubusercontent.com/u/109097090?v=4"
            alt="Student"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium">QID: {student?.Q_Id}</p>
          <p className="text-sm">SID: {student._id}</p>
        </div>
      </div>
    </div>
  );
};

export default UnVerifiedStudentCard;
