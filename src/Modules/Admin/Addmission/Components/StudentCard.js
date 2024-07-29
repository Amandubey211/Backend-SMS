import React from "react";
import { GiArmorUpgrade } from "react-icons/gi";
import CardBanner from "../../../../Assets/AdmissionCard/CardBanner.jpg";

const StudentCard = ({ studentInfo, imagePreview }) => {
  const {
    firstName,
    lastName,
    studentId,
    class: studentClass,
    section,
    bloodGroup,
    nationality,
    email,
  } = studentInfo;

  return (
    <div className="pb-4 mt-2 bg-white rounded-lg shadow-md w-64 border">
      <div className="flex flex-col items-center">
        <div
          className="w-full h-40 bg-cover bg-center rounded-t-md relative flex justify-center items-center"
          style={{ backgroundImage: `url(${CardBanner})` }}
        >
          <div className="absolute top-2 left-2 text-white text-sm font-semibold">
            <div className="flex items-center space-x-1">
              <GiArmorUpgrade className="w-5 h-5 text-pink-600" />
              <span>Student Diwan</span>
            </div>
          </div>
          <div className="mt-4 bg-white rounded-full flex justify-center items-center">
            <img
              src={imagePreview || "https://via.placeholder.com/150"}
              alt={firstName}
              className="rounded-full w-24 h-24 object-cover"
            />
          </div>
        </div>
        <div className="mt-4 text-center">
          <h2 className="text-lg font-semibold">
            {firstName + " " + lastName || "Student Name"}
          </h2>
          <div className="text-sm text-gray-600 mt-2 space-y-1 text-left">
            <p>
              <span className="font-semibold">ID No</span>: {studentId}
            </p>
            <p>
              <span className="font-semibold">Class</span>: {studentClass}
            </p>
            <p>
              <span className="font-semibold">Section</span>: {section}
            </p>
            <p>
              <span className="font-semibold">Blood</span>: {bloodGroup}
            </p>
            <p>
              <span className="font-semibold">Nationality</span>: {nationality}
            </p>
            <p>
              <span className="font-semibold">Email</span>: {email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
