import React, { useState } from "react";
import "tailwindcss/tailwind.css";
import Sidebar from "../../../Components/Common/Sidebar";
import AssignTeacher from "./AssignTeacher";

const NavigationBar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);
  return (
    <>
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold">All Teachers</h1>
          <span className="bg-purple-200 text-purple-700 rounded-full px-2 py-1 text-sm">
            20
          </span>
        </div>

        <button
          onClick={handleSidebarOpen}
          className="flex items-center border border-gray-300 ps-5  py-0 rounded-full"
        >
          <span className="mr-2">Assign Teacher</span>
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-12 h-12 flex items-center justify-center">
            <span className="text-3xl -mt-2">+</span>
          </div>
        </button>
      </div>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
        title="Assign new Teacher"
      >
        <AssignTeacher />
      </Sidebar>

      <div className="flex space-x-2 px-5">
        <button className="px-4 py-2 rounded-full border border-gray-300">
          Everyone
        </button>
        <button className="px-4 py-2 rounded-full bg-gradient-to-r from-red-400 to-purple-500 text-white">
          Section 1
        </button>
        <button className="px-4 py-2 rounded-full border border-gray-300">
          Section 2
        </button>
        <button className="px-4 py-2 rounded-full border border-gray-300">
          Section 3
        </button>
        <button className="px-4 py-2 rounded-full border border-gray-300">
          Section 4
        </button>
      </div>
    </>
  );
};

export default NavigationBar;
