import React from "react";

const SubjectCard = ({ subject }) => {
  const { name, startDate, totalModules, completedModules, progress } = subject;

  return (
    <div
      className="bg-white shadow-lg rounded-lg p-2 border border-gray-300 flex flex-col gap-2"
      style={{ width: "300px", marginBottom: "8px" }}
    >
      <div className="flex items-center gap-2">
        <img
          src="https://plus.unsplash.com/premium_photo-1666900440561-94dcb6865554?q=80&w=1854&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Profile"
          className="h-10 w-10 mr-2 rounded-lg"
        />
        <div className="flex flex-col">
          <span>{name}</span>
          <span className="text-[12px] text-gray-600">Started:0</span>
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `70%` }}
        ></div>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">0/{totalModules} Module</p>
        <p className="text-sm text-gray-500">70%</p>
      </div>
    </div>
  );
};

export default SubjectCard;
