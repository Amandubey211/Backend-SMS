import React from 'react';
import { useNavigate } from "react-router-dom";
import rightArrow from '../../../Assets/ParentAssets/svg/right-arrow.svg';
import { useTranslation } from 'react-i18next';
import profileIcon from '../../../Assets/DashboardAssets/profileIcon.png';
import { FaBookOpen, FaChalkboardTeacher, FaChartLine, FaUserCheck } from 'react-icons/fa';
import { setSelectedChild } from '../../../Store/Slices/Parent/Children/childrenSlice';

export const ChildCard = ({ student }) => {
  const navigate = useNavigate();
   console.log("student data:-> ",student)
  // Safeguard values if fields are missing
  const {
    name = "N/A",
    class: className = "N/A",
    admissionNumber = "N/A",
    section = "N/A",
    group = "N/A",
    profile = profileIcon,
  } = student || {};

  return (
    <div className="bg-white rounded-md p-4 flex flex-col justify-between h-full border">
      {/* Top Section: Profile & Basic Info */}
      <div>
        <div className="flex items-center space-x-3 mb-4">
          <div className="border rounded-full">
            <img
              src={profile}
              alt={name}
              className="w-16 h-16 rounded-full object-cover border"
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{name}</h2>
            <p className="text-sm text-gray-600">
              Class: {className} | ID: {admissionNumber}
            </p>
            <p className="text-sm text-gray-600">
              Section: {section} | Group: {group}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Section: 4 Buttons in a 2×2 grid */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/teacher/${student.id}`);
          }}
          className="flex items-center justify-center space-x-2 py-2 rounded bg-blue-100 hover:bg-blue-200 transition"
        >
          <FaChalkboardTeacher />
          <span>Instructors</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/childgrade/${student.id}`);
          }}
          className="flex items-center justify-center space-x-2 py-2 rounded bg-pink-100 hover:bg-pink-200 transition"
        >
          <FaBookOpen />
          <span>Grades</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/attendance/${student.id}`);
          }}
          className="flex items-center justify-center space-x-2 py-2 rounded bg-green-100 hover:bg-green-200 transition"
        >
          <FaUserCheck />
          <span>Attendance</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/checkprogress/${student.id}`);
          }}
          className="flex items-center justify-center space-x-2 py-2 rounded bg-purple-100 hover:bg-purple-200 transition"
        >
          <FaChartLine />
          <span>Progress</span>
        </button>
      </div>
    </div>
  );
};


export default ChildCard;
