import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import profileImage from "../../../../../../Assets/DashboardAssets/profileIcon.png";

const TeacherModal = ({ teacher, onClose }) => {

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative animate-scaleUp">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <AiOutlineClose size={24} />
        </button>

        {/* Profile Image */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 mb-4">
            <img
              src={teacher?.profile || profileImage}
              alt={`${teacher?.name}'s Profile`}
              className="object-cover w-full h-full rounded-full border-4 border-purple-500"
            />
          </div>
        </div>

        {/* Modal Content */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">{teacher?.name || "N/A"}</h2>
          <p className="text-gray-600">Subject: {teacher?.subject || "N/A"}</p>
          <p className="text-gray-600">Phone: {teacher?.phone || "N/A"}</p>
        </div>
      </div>
    </div>
  );
};

export default TeacherModal;
