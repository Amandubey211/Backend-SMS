// Components/StudentProfile.js
import React from "react";
import profileIcon from "../../../../../Assets/DashboardAssets/profileIcon.png";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const StudentProfileCard = ({ student }) => {
  const { role } = useSelector((store) => store.common.auth);
  console.log(role, "lllllll");
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center p-3 py-5 gap-2 justify-center">
      <img
        src={student?.profile || profileIcon}
        alt="student_image"
        className="rounded-full w-[100px] h-[100px] bg-gray-300 border"
      />
      <span className="font-bold">{student?.firstName}</span>
      <div className="flex gap-4 font-medium text-gray-500 flex-row text-sm ">
        <span className="text-black">
          Class:{" "}
          <span className="text-gray-500">{student?.className || "N/A"}</span>{" "}
          <span className="text-gray-300">|</span>{" "}
        </span>
        <span className="text-black">
          Section:{" "}
          <span className="text-gray-500">{student?.sectionName || "N/A"}</span>
        </span>
      </div>
      <span>
        ID:{" "}
        <span className="text-gray-500">
          {student?.admissionNumber || "N/A"}
        </span>
      </span>

      {(role === "admin" || role === "teacher") && (
        <div
          className="border rounded-md px-9 py-1 border-red-300 cursor-pointer"
          onClick={() => navigate(`/class/${student.presentClassId}`)}
        >
          <span className="font-semibold bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text">
            Class
          </span>
        </div>
      )}
    </div>
  );
};

export default StudentProfileCard;
