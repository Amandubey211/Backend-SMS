import React from "react";

const StudentCard = ({ studentInfo, imagePreview }) => {
  const {
    name,
    studentId,
    class: studentClass,
    section,
    bloodGroup,
    religion,
    email,
  } = studentInfo;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md w-64">
      <div className="flex flex-col items-center">
        <div className="w-full h-40 bg-gradient-to-r rounded-md from-pink-500 to-purple-500 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={imagePreview || "https://via.placeholder.com/150"}
              alt={name}
              className="rounded-full w-24 h-24 border-4 border-white object-cover"
            />
          </div>
          <div className="absolute top-2 left-2 text-white text-sm font-semibold">
            Student Diwan
          </div>
        </div>
        <div className=" mt-6">
          <h2 className="text-lg  text-center font-semibold">
            {name || "Name"}
          </h2>
          <div className="text-sm text-gray-600 mt-2">
            <p>ID No: {studentId}</p>
            <p>Class: {studentClass}</p>
            <p>Section: {section}</p>
            <p>Blood: {bloodGroup}</p>
            <p>Religion: {religion}</p>
            <p>Email: {email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
