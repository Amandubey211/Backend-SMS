import React from "react";



const StudentProfile = ({student}) => {
  

  return (
    <div className="bg-white  h-screen  px-7 py-2">
    <h2 className="text-base font-normal text-gray-600 mb-3">Education</h2>
    <ul className="space-y-3">
      {student?.information?.educationHistory.map((edu, index) => (
        <li key={index} className="border-l-4 border-purple-500 pl-4">
          {/* <h4 className="text-lg font-semibold">{edu.degree}</h4> */}
          {/* <p className="text-sm text-gray-600">{edu.school}</p> */}
          <p className="text-base text-gray-900">{edu.year}</p>
          <p className="text-sm text-gray-500">{edu.description}</p>
        </li>
      ))}
    </ul>
  </div>
  );
};



export default StudentProfile;
