import React from "react";
import { FaCalendarAlt } from "react-icons/fa"; // Example icon

const MainSection = () => {
  return (
    <div className="flex flex-col items-center justify-center p-10 bg-gray-100 h-full">
      {/* Big Icon */}
      <FaCalendarAlt className="text-purple-500 text-5xl mb-4" />

      {/* Heading Text */}
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Academic Year</h1>

      {/* Description Text */}
      <p className="text-lg text-gray-600 text-center max-w-md">
        Manage the current academic year settings, details, and preferences for
        your institution. Set important dates, schedules, and more.
      </p>
    </div>
  );
};

export default MainSection;
