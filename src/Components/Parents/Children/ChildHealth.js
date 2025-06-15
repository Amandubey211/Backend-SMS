import React from "react";

const ChildHealth = ({ student }) => {
  const {
    name = "N/A",
    bloodGroup = "N/A",
    height = "N/A",
    weight = "N/A",
    medicalCondition = "None",
    healthRisk = "N/A",
  } = student || {};

  return (
    <div className="flex flex-col items-center p-6 space-y-6 bg-gray-100 min-h-screen">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        <div className="mb-6">
          <p className="text-gray-600">Name: {name}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-4 bg-blue-100 rounded-md shadow-md">
            <h3 className="text-lg font-bold text-blue-600">Blood Group</h3>
            <p className="text-xl text-gray-800">{bloodGroup}</p>
          </div>
          <div className="p-4 bg-green-100 rounded-md shadow-md">
            <h3 className="text-lg font-bold text-green-600">Height</h3>
            <p className="text-xl text-gray-800">{height}</p>
          </div>
          <div className="p-4 bg-yellow-100 rounded-md shadow-md">
            <h3 className="text-lg font-bold text-yellow-600">Weight</h3>
            <p className="text-xl text-gray-800">{weight}</p>
          </div>
          <div className="p-4 bg-red-100 rounded-md shadow-md">
            <h3 className="text-lg font-bold text-red-600">Health Risk</h3>
            <p className="text-xl text-gray-800">{healthRisk}</p>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700">Medical Condition</h3>
          <div
    className="text-gray-600"
    dangerouslySetInnerHTML={{ __html: medicalCondition }}
  />
        </div>
      </div>
    </div>
  );
};

export default ChildHealth;
