import React from "react";
import { GiArmorUpgrade } from "react-icons/gi";
import CardBanner from "../../../../Assets/AdmissionCard/CardBanner.jpg";
import Logo from "../../../../Components/Common/Logo";

const StudentCard = ({ studentInfo, imagePreview }) => {
  const {
    firstName,
    lastName,
    Q_Id,
    contactNumber,
    class: studentClass,
    section,
    bloodGroup,
    nationality,
    email,
  } = studentInfo;

  // Truncate email if it is longer than 20 characters
  const truncateEmail = (email) => {
    return email.length > 20 ? email.substring(0, 20) + "..." : email;
  };

  return (
    <div className="pb-4 mt-2 bg-white rounded-lg shadow-md w-64 border">
      <div className="flex flex-col ">
        <div
          className="w-full h-40 bg-cover bg-center rounded-t-md relative flex justify-center items-center"
          style={{ backgroundImage: `url(${CardBanner})` }}
        >
          <div className="absolute top-2 left-2 text-white text-sm font-semibold">
            <div className="flex items-center space-x-1">
              <Logo height="h-6" />
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
        <div className="mt-4  px-4">
          <h2 className="text-lg text-center font-semibold">
            {firstName + " " + lastName || "Student Name"}
          </h2>
          <div className="text-sm text-gray-600 mt-2 space-y-1 ">
            <p>
              <span className="font-semibold">QID</span>: {Q_Id}
            </p>
            <p>
              <span className="font-semibold">Class</span>: {studentClass}
            </p>

            <p>
              <span className="font-semibold">Blood</span>: {bloodGroup}
            </p>
            <p>
              <span className="font-semibold">Nationality</span>: {nationality}
            </p>
            <p title={email}>
              <span className="font-semibold">Email</span>:{" "}
              {truncateEmail(email)}
            </p>
            <p>
              <span className="font-semibold">Number</span>: {contactNumber}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
