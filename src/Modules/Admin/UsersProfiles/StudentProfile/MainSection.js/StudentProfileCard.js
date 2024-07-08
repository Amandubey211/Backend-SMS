// Components/StudentProfile.js
import React from "react";

const StudentProfileCard = ({ student }) => {
  return (
    <div className="flex flex-col items-center p-3 py-5 gap-2 justify-center">
      <img src={student.imageUrl} alt="student_image" className="rounded-full w-[100px] h-[100px]" />
      <span className="font-bold">{student.name}</span>
      <div className="flex gap-4 font-medium text-gray-500 ">
        <span>Class {student.class} |</span> 
        <span>Section {student.section} | </span>
        <span>ID: {student.id}</span>
      </div>
      <div className="border rounded-md px-9 py-1 border-red-300 ">
        <span className=' font-semibold bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text'> Class {student.class}</span>
      </div>
    </div>
  );
};

export default StudentProfileCard;
