import React from "react";
import { NavLink } from "react-router-dom";
import { mockStudents } from "../../Verification/VerificationData/NonVerifiedStudentData";

// Function to generate a random color
const getRandomColor = () => {
  const colors = [
    "bg-yellow-300",
    "bg-blue-300",
    "bg-green-300",
    "bg-red-300",
    "bg-purple-300",
    "bg-pink-300",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const StudentList = () => {
  const unverifiedStudents = mockStudents.filter(
    (student) => !student.isVerifiedDocuments
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Unverified Students
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {unverifiedStudents.map((student) => (
          <div
            key={student._id.$oid}
            className={`${getRandomColor()} p-6 rounded-lg shadow-md text-white relative`}
          >
            <button className="absolute top-4 right-4 bg-white text-gray-800 font-semibold py-1 px-3 rounded-full shadow-md">
              Publish
            </button>
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Chemical Engineering</h2>
              <p className="text-sm">Plant Design</p>
              <div className="flex items-center mt-2">
                <span className="mr-2">👤</span>
                <p className="text-sm">40</p>
                <span className="mx-2">|</span>
                <span className="mr-2">📚</span>
                <p className="text-sm">12 Module</p>
              </div>
            </div>
            <div className="flex items-center mt-4">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img
                  src="https://via.placeholder.com/150"
                  alt="Teacher"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">Annette Black</p>
                <p className="text-sm">Teacher</p>
              </div>
            </div>
            <NavLink
              to={`/verify_students/${student._id.$oid}`}
              className="block py-2 px-4 bg-blue-500 text-center rounded-lg hover:bg-blue-600 transition-colors mt-4"
            >
              Verify
            </NavLink>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentList;
