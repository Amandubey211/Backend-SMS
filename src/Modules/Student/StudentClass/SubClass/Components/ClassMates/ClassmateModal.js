import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import profileImage from "../../../../../../Assets/DashboardAssets/profileIcon.png";

const ClassmateModal = ({ classmate, onClose }) => {
  const groups = classmate?.group?.split(",").map((group) => group.trim()) || [];

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
              src={classmate?.profile || profileImage}
              alt={`${classmate?.name}'s Profile`}
              className="object-cover w-full h-full rounded-full border-4 border-purple-500"
            />
          </div>
        </div>

        {/* Modal Content */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">{classmate?.name || "N/A"}</h2>
          <p className="text-gray-600">Contact: +{classmate?.number || "N/A"}</p>
          <p className="text-gray-600">Admission Number: {classmate?.admissionNumber || "N/A"}</p>

          <div className="text-gray-600">
            <p className="font-semibold">Group(s):</p>
            <ul className="list-disc list-inside text-gray-700">
              {groups.length > 0 ? (
                groups.map((group, index) => (
                  <li key={index} className="font-medium">{group || "N/A"}</li>
                ))
              ) : (
                <li>N/A</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassmateModal;
