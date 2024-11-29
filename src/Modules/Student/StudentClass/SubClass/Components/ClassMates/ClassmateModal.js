import React from "react";
import profileImage from "../../../../../../Assets/DashboardAssets/profileIcon.png";

const ClassmateModal = ({ classmate }) => {
  const groups = classmate?.group?.split(",")?.map((group) => group.trim()) || [];

  return (
  
      <div className="bg-white w-full max-w-md p-6  relative animate-scaleUp">
      

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
            <ul className="list-disc list-inside text-gray-700 flex items-start flex-col px-20">
              {groups.length > 0 ? (
                groups?.map((group, index) => (
                  <li key={index} className="font-medium">{group || "N/A"}</li>
                ))
              ) : (
                <li>N/A</li>
              )}
            </ul>
          </div>
        </div>
      </div>
  );
};

export default ClassmateModal;
