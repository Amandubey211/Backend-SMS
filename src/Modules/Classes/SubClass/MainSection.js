import React from "react";

const MainSection = () => {
  return (
    <div className="flex space-x-4 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 text-center">
        <div className="text-5xl">🏫</div>
        <div className="mt-4 text-lg">20 Teacher Assigned</div>
      </div>
      <div className="bg-white shadow-lg rounded-lg p-6 text-center">
        <div className="text-5xl">🏫</div>
        <div className="mt-4 text-lg">3 Section | 11 Groups</div>
      </div>
      <div className="bg-white shadow-lg rounded-lg p-6 text-center">
        <div className="text-5xl">🎓</div>
        <div className="mt-4 text-lg">250 Students</div>
      </div>
      <div className="bg-white shadow-lg rounded-lg p-6 text-center">
        <div className="text-5xl">📅</div>
        <div className="mt-4 text-lg">Attendance</div>
      </div>
    </div>
  );
};

export default MainSection;
